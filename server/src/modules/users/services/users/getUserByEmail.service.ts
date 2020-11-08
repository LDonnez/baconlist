import { Injectable, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "../../entities/user.entity"

@Injectable()
export class GetUserByEmailService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  public async execute(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email })
    if (!user) {
      throw new BadRequestException(`user with email: ${email} does not exist`)
    }
    return user
  }
}
