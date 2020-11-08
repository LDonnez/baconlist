import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Friend } from "../../entities/friend.entity"

@Injectable()
export class RetrieveFriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>
  ) {}

  public async execute(userId: string): Promise<Friend[]> {
    const q = this.friendRepository
      .createQueryBuilder("friend")
      .select("friend.id", "id")
      .addSelect("u.first_name", "firstName")
      .addSelect("u.last_name", "lastName")
      .addSelect("friend.friend_id", "friendId")
      .innerJoin("users", "u", "u.id = friend.friend_id")
      .where("friend.user_id = :userId", { userId })
    return await q.getRawMany()
  }
}
