import { Injectable, Inject, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../../../prisma/prisma.service"
import { User } from "@prisma/client"

@Injectable()
export class GetUserByEmailService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  public async execute(email: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true
      }
    })
    if (!user) {
      throw new NotFoundException(`user with email: ${email} does not exist`)
    }
    return user
  }
}
