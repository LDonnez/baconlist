import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../../../prisma/prisma.service"
import { FriendRequestDto } from "../../dto/friendRequest.dto"

@Injectable()
export class DeleteFriendRequestService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService
  ) {}

  public async execute(
    userId: string,
    friendRequestId: string
  ): Promise<FriendRequestDto> {
    const friendRequest = await this.prismaService.friendRequest.findFirst({
      where: {
        receiverId: userId,
        id: friendRequestId
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
    if (!friendRequest) {
      throw new NotFoundException(
        `friend request with id: ${friendRequestId} does not exist`
      )
    }
    await this.prismaService.friendRequest.delete({
      where: { id: friendRequest.id }
    })
    return friendRequest
  }
}
