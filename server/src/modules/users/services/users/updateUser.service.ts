import { Injectable, Inject } from "@nestjs/common"
import { User } from "../../entities/user.entity"
import { UpdateUserDto } from "../../dto/updateUser.dto"
import { GetUserByIdService } from "./getUserById.service"

@Injectable()
export class UpdateUserService {
  constructor(
    @Inject(GetUserByIdService)
    private readonly getUserByIdService: GetUserByIdService
  ) {}

  public async execute(id: string, userData: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id)
    user.firstName = userData.firstName
    user.lastName = userData.lastName
    return await user.save()
  }

  private async getUserById(id: string): Promise<User> {
    return await this.getUserByIdService.execute(id)
  }
}
