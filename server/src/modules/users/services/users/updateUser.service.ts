import { Injectable, Inject, BadRequestException } from "@nestjs/common"
import { UpdateUserDto, UserDto } from "../../dto/user.dto"
import { PrismaService } from "../../../prisma/prisma.service"

@Injectable()
export class UpdateUserService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  public async execute(id: string, userData: UpdateUserDto): Promise<UserDto> {
    try {
      return await this.prismaService.user.update({
        where: {
          id
        },
        data: {
          ...userData,
          updatedAt: new Date().toISOString()
        },
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
    } catch (error) {
      throw new BadRequestException(`user with id: ${id} not found`)
    }
  }
}
