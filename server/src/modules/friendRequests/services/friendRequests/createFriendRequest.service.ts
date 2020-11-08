import { Injectable, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FriendRequest } from "../../entities/friendRequest.entity"
import { CreateFriendRequestDto } from "../../dto/createFriendRequest.dto"

@Injectable()
export class CreateFriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>
  ) {}

  public async execute(
    userId: string,
    friendRequestData: CreateFriendRequestDto
  ): Promise<FriendRequest> {
    if (await this.alreadyExists(userId, friendRequestData)) {
      throw new BadRequestException(
        `friend request with friendId: ${friendRequestData.receiverId} already exists `
      )
    }
    const newFriendRequest = this.buildFriendRequest(userId, friendRequestData)
    const result = await this.friendRequestRepository.save(newFriendRequest)
    return result
  }

  private buildFriendRequest(
    userId: string,
    friendRequestData: CreateFriendRequestDto
  ): FriendRequest {
    const friendRequest = new FriendRequest()
    friendRequest.requesterId = userId
    friendRequest.receiverId = friendRequestData.receiverId
    return friendRequest
  }

  private async alreadyExists(
    userId: string,
    friendRequestData: CreateFriendRequestDto
  ): Promise<boolean> {
    const friendRequest = await this.friendRequestRepository.findOne({
      receiverId: friendRequestData.receiverId,
      requesterId: userId
    })
    if (!friendRequest) {
      return false
    }
    return true
  }
}
