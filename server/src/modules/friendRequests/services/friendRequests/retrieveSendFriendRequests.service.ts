import { Inject, Injectable } from "@nestjs/common"
import { PrismaService } from "../../../prisma/prisma.service"
import { FriendRequest } from "@prisma/client"

@Injectable()
export class RetrieveSendFriendRequestsService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService
  ) {}

  public async execute(userId: string): Promise<FriendRequest[]> {
    return await this.prismaService.friendRequest.findMany({
      where: {
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
