import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FriendRequest } from "../../entities/friendRequest.entity"

@Injectable()
export class RetrieveSendFriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>
  ) {}

  public async execute(userId: string): Promise<FriendRequest[]> {
    const q = this.friendRequestRepository
      .createQueryBuilder("friend_request")
      .select("friend_request.id", "id")
      .addSelect("receiver.first_name", "firstName")
      .addSelect("receiver.last_name", "lastName")
      .addSelect("receiver.id", "friendId")
      .innerJoin(
        "users",
        "receiver",
        "receiver.id = friend_request.receiver_id"
      )
      .where("friend_request.requester_id = :userId", { userId })
    return await q.getRawMany()
  }
}
