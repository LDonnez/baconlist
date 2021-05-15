import { Injectable, BadRequestException, Inject } from "@nestjs/common"
import { hash } from "bcrypt"
import { CreateUserDto } from "../../dto/user.dto"
import { PrismaService } from "../../../prisma/prisma.service"
import { UserDto } from "../../dto/user.dto"

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  public async execute(userData: CreateUserDto): Promise<UserDto> {
    if (await this.alreadyExists(userData)) {
      throw new BadRequestException(
        `user with email: ${userData.email} already exists `
      )
    }
    return await this.createUser(userData)
  }

  private async createUser(userData: CreateUserDto): Promise<UserDto> {
    return await this.prismaService.user.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: await this.hashPassword(userData.password)
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
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10)
  }

  private async alreadyExists(userData: CreateUserDto): Promise<boolean> {
    const user = await this.prismaService.user.findFirst({
      where: { email: userData.email }
    })
    if (!user) {
      return false
    }
    return true
  }
}
