import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FriendRequest } from "../../entities/friendRequest.entity"

@Injectable()
export class DeleteFriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>
  ) {}

  public async execute(
    userId: string,
    friendRequestId: string
  ): Promise<FriendRequest> {
    const friendRequest = await this.friendRequestRepository.findOne({
      receiverId: userId,
      id: friendRequestId
    })
    if (!friendRequest) {
      throw new NotFoundException(
        `friend request with id: ${friendRequestId} does not exist`
      )
    }
    await this.friendRequestRepository.remove(friendRequest)
    return friendRequest
  }
}
