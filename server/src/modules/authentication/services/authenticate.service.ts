import { Injectable, BadRequestException, Inject } from "@nestjs/common"
import { GetUserByEmailService } from "../../users/services/users/getUserByEmail.service"
import { User } from "../../users/entities/user.entity"
import { compare } from "bcrypt"
import { AuthenticationDto } from "../dto/authentication.dto"

@Injectable()
export class AuthenticateService {
  constructor(
    @Inject(GetUserByEmailService)
    private readonly getUserByEmailService: GetUserByEmailService
  ) {}

  public async execute(
    data: AuthenticationDto
  ): Promise<Omit<User, "password">> {
    const user = await this.getUserByEmail(data.email)
    if (!await compare(data.password, user.password ?? "")) {
      throw new BadRequestException("password or email is not correct")
    }
    delete user.password
    return user
  }

  private async getUserByEmail(email: string): Promise<User> {
    return await this.getUserByEmailService.execute(email)
  }
}
