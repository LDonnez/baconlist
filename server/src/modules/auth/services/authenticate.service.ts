import { Injectable, Inject, UnauthorizedException } from "@nestjs/common"
import { GetUserByEmailService } from "../../users/services/users/getUserByEmail.service"
import { User } from "@prisma/client"
import { compare } from "bcrypt"
import { AuthenticationDto } from "../dto/authentication.dto"
import { UserDto } from "../../users/dto/user.dto"

@Injectable()
export class AuthenticateService {
  constructor(
    @Inject(GetUserByEmailService)
    private readonly getUserByEmailService: GetUserByEmailService
  ) {}

  public async execute(data: AuthenticationDto): Promise<UserDto> {
    try {
      const user = await this.getUserByEmail(data.email)
      if (!await compare(data.password, user.password)) {
        throw new UnauthorizedException("not allowed")
      }
      const u: UserDto = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
      return u
    } catch (error) {
      throw new UnauthorizedException("not allowed")
    }
  }

  private async getUserByEmail(email: string): Promise<User> {
    return await this.getUserByEmailService.execute(email)
  }
}
