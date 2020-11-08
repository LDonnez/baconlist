import { Injectable, BadRequestException } from "@nestjs/common"
import { GetUserByEmailService } from "../../users/services/users/getUserByEmail.service"
import { User } from "../../users/entities/user.entity"
import { compare } from "bcrypt"
import { AuthenticateDto } from "../dto/authenticate.dto"

@Injectable()
export class AuthenticateService {
  constructor(private readonly getUserByEmailService: GetUserByEmailService) {}

  public async execute(data: AuthenticateDto): Promise<User> {
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
