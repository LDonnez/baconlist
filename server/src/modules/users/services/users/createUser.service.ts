import { Injectable, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "../../entities/user.entity"
import { hash } from "bcrypt"
import { CreateUserDto } from "../../dto/createUser.dto"

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  public async execute(userData: CreateUserDto): Promise<User> {
    if (await this.alreadyExists(userData)) {
      throw new BadRequestException(
        `user with email: ${userData.email} already exists `
      )
    }
    const newUser = await this.buildUser(userData)
    const result = await this.userRepository.save(newUser)
    delete result.password
    return result
  }

  private async buildUser(userData: CreateUserDto): Promise<User> {
    const user = new User()
    user.firstName = userData.firstName
    user.lastName = userData.lastName
    user.email = userData.email
    user.password = await this.hashPassword(userData.password)
    return user
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10)
  }

  private async alreadyExists(userData: CreateUserDto): Promise<boolean> {
    const user = await this.userRepository.findOne({ email: userData.email })
    if (!user) {
      return false
    }
    return true
  }
}
