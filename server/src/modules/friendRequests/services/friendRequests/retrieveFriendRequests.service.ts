import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FriendRequest } from "../../entities/friendRequest.entity"

@Injectable()
export class RetrieveFriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>
  ) {}

  public async execute(userId: string): Promise<FriendRequest[]> {
    const q = this.friendRequestRepository
      .createQueryBuilder("friend_request")
      .select("friend_request.id", "id")
      .addSelect("requester.first_name", "firstName")
      .addSelect("requester.last_name", "lastName")
      .addSelect("requester.id", "friendId")
      .innerJoin(
        "users",
        "requester",
        "requester.id = friend_request.requester_id"
      )
      .where("friend_request.receiver_id = :userId", { userId })
    return await q.getRawMany()
  }
}
