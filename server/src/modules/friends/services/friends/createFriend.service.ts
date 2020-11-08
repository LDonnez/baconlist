import { Injectable, BadRequestException } from "@nestjs/common"
import { InjectRepository, InjectConnection } from "@nestjs/typeorm"
import { Repository, Connection, EntityManager } from "typeorm"
import { Friend } from "../../entities/friend.entity"
import { CreateFriendDto } from "../../dto/createFriend.dto"
import { FriendRequest } from "../../../friendRequests/entities/friendRequest.entity"

@Injectable()
export class CreateFriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectConnection() private readonly connection: Connection
  ) {}

  public async execute(
    userId: string,
    friendData: CreateFriendDto
  ): Promise<Friend> {
    if (await this.alreadyExists(userId, friendData)) {
      throw new BadRequestException(
        `friend whit id: ${friendData.friendId} already exists`
      )
    }

    if (!await this.hasFriendRequest(userId, friendData)) {
      throw new BadRequestException(
        `no friend request found for friend with id ${friendData.friendId}`
      )
    }
    return await this.connection.transaction(async (manager: EntityManager) => {
      const newFriendForReceiver = this.buildFriend(friendData.friendId, userId)
      const newFriend = this.buildFriend(userId, friendData.friendId)
      await manager.delete(FriendRequest, {
        requesterId: userId,
        receiverId: friendData.friendId
      })
      await manager.delete(FriendRequest, {
        requesterId: friendData.friendId,
        receiverId: userId
      })
      await manager.save(newFriendForReceiver)
      return await manager.save(newFriend)
    })
  }

  private buildFriend(userId: string, friendId: string): Friend {
    const friend = new Friend()
    friend.userId = userId
    friend.friendId = friendId
    return friend
  }

  private async alreadyExists(
    userId: string,
    friendData: CreateFriendDto
  ): Promise<Friend | undefined> {
    return await this.friendRepository.findOne({
      userId: userId,
      friendId: friendData.friendId
    })
  }

  private async hasFriendRequest(
    userId: string,
    friendData: CreateFriendDto
  ): Promise<FriendRequest | undefined> {
    return await this.friendRequestRepository.findOne({
      receiverId: friendData.friendId,
      requesterId: userId
    })
  }
}
