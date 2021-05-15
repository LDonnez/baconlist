import { Inject, Injectable } from "@nestjs/common"
import { PrismaService } from "../../../prisma/prisma.service"
import { FriendDto } from "../../dto/friend.dto"

@Injectable()
export class RetrieveFriendsService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService
  ) {}

  public async execute(userId: string): Promise<FriendDto[]> {
    return await this.prismaService.friend.findMany({
      where: {
        userId
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
}
