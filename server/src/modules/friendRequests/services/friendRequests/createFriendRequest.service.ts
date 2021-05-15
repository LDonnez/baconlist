import { Injectable, BadRequestException, Inject } from "@nestjs/common"
import {
  CreateFriendRequestDto,
  FriendRequestDto
} from "../../dto/friendRequest.dto"
import { PrismaService } from "../../../prisma/prisma.service"

@Injectable()
export class CreateFriendRequestService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService
  ) {}

  public async execute(
    userId: string,
    friendRequestData: CreateFriendRequestDto
  ): Promise<FriendRequestDto> {
    if (await this.requestAlreadyExists(userId, friendRequestData)) {
      throw new BadRequestException(
        `friend request with userId: ${friendRequestData.receiverId} already exists `
      )
    }

    if (await this.friendAlreadyExists(userId, friendRequestData)) {
      throw new BadRequestException(
        `friend with userId: ${friendRequestData.receiverId} already exists `
      )
    }
    return await this.prismaService.friendRequest.create({
      data: { requesterId: userId, receiverId: friendRequestData.receiverId },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            updatedAt: true,
            createdAt: true,
            password: false
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            updatedAt: true,
            createdAt: true,
            password: false
          }
        }
      }
    })
  }

  private async requestAlreadyExists(
    userId: string,
    friendRequestData: CreateFriendRequestDto
  ): Promise<boolean> {
    const friendRequest = await this.prismaService.friendRequest.findFirst({
      where: {
        receiverId: friendRequestData.receiverId,
        requesterId: userId
      }
    })
    if (!friendRequest) {
      return false
    }
    return true
  }

  private async friendAlreadyExists(
    userId: string,
    friendRequestData: CreateFriendRequestDto
  ): Promise<boolean> {
    const friend = await this.prismaService.friend.findFirst({
      where: {
        userId,
        friendId: friendRequestData.receiverId
      }
    })
    if (!friend) {
      return false
    }
    return true
  }
}
