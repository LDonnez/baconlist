import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "../../entities/user.entity"

@Injectable()
export class GetUserByIdService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  public async execute(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id })
    if (!user) {
      throw new NotFoundException(`user with id: ${id} does not exist`)
    }
    delete user.password
    return user
  }
}
