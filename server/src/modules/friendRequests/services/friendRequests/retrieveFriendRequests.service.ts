import { Inject, Injectable } from "@nestjs/common"
import { PrismaService } from "../../../prisma/prisma.service"
import { FriendRequestDto } from "../../dto/friendRequest.dto"

@Injectable()
export class RetrieveFriendRequestsService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService
  ) {}

  public async execute(userId: string): Promise<FriendRequestDto[]> {
    return await this.prismaService.friendRequest.findMany({
      where: {
        receiverId: userId
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
