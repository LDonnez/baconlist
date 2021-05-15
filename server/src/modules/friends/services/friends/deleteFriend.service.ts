import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../../../prisma/prisma.service"
import { FriendDto } from "../../dto/friend.dto"

@Injectable()
export class DeleteFriendService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  public async execute(userId: string, friendId: string): Promise<FriendDto> {
    const friend = await this.prismaService.friend.findFirst({
      where: {
        id: friendId,
        userId: userId
      }
    })
    if (!friend) {
      throw new NotFoundException(`friend with id: ${friendId} is not found`)
    }
    const [, deletedFriend] = await this.prismaService.$transaction([
      this.prismaService.friend.deleteMany({
        where: { userId: friend.friendId, friendId: friend.userId }
      }),
      this.prismaService.friend.delete({
        where: { id: friend.id },
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
    return deletedFriend
  }
}
