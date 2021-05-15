import { Injectable, BadRequestException, Inject } from "@nestjs/common"
import { FriendRequestDto } from "../../../friendRequests/dto/friendRequest.dto"
import { PrismaService } from "../../../prisma/prisma.service"
import { FriendDto, CreateFriendDto } from "../../dto/friend.dto"

@Injectable()
export class CreateFriendService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService
  ) {}

  public async execute(
    userId: string,
    friendData: CreateFriendDto
  ): Promise<FriendDto> {
    if (await this.alreadyExists(userId, friendData)) {
      throw new BadRequestException(
        `friend whit id: ${friendData.friendId} already exists`
      )
    }

    if (!await this.hasFriendRequest(userId, friendData)) {
      throw new BadRequestException(
        `no friend request found for friend with id ${friendData.friendId}`
      )
    }
    const [, , friend] = await this.prismaService.$transaction([
      this.prismaService.friendRequest.deleteMany({
        where: { requesterId: userId, receiverId: friendData.friendId }
      }),
      this.prismaService.friendRequest.deleteMany({
        where: { requesterId: friendData.friendId, receiverId: userId }
      }),
      this.prismaService.friend.create({
        data: {
          userId,
          friendId: friendData.friendId
        },
        include: {
          friend: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              password: false,
              createdAt: true,
              updatedAt: true
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              password: false,
              createdAt: true,
              updatedAt: true
            }
          }
        }
      })
    ])
    return friend
  }

  private async alreadyExists(
    userId: string,
    friendData: CreateFriendDto
  ): Promise<FriendDto | null> {
    return await this.prismaService.friend.findFirst({
      where: {
        userId: userId,
        friendId: friendData.friendId
      },
      include: {
        friend: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: false,
            createdAt: true,
            updatedAt: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: false,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    })
  }

  private async hasFriendRequest(
    userId: string,
    friendData: CreateFriendDto
  ): Promise<FriendRequestDto | null> {
    return await this.prismaService.friendRequest.findFirst({
      where: {
        receiverId: friendData.friendId,
        requesterId: userId
      },
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
}
