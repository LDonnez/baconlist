import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../../../prisma/prisma.service"
import { UserDto } from "../../dto/user.dto"

@Injectable()
export class GetUserByIdService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  public async execute(id: string): Promise<UserDto> {
    const user = await this.prismaService.user.findFirst({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true
      }
    })
    if (!user) {
      throw new NotFoundException(`user with id: ${id} does not exist`)
    }
    return user
  }
}
