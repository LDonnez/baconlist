import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectConnection } from "@nestjs/typeorm"
import { Connection, EntityManager } from "typeorm"
import { Friend } from "../../entities/friend.entity"

@Injectable()
export class DeleteFriendService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  public async execute(userId: string, friendId: string): Promise<Friend> {
    return await this.connection.transaction(async (manager: EntityManager) => {
      const friend = await manager.findOne(Friend, {
        id: friendId,
        userId: userId
      })
      if (!friend) {
        throw new NotFoundException(`friend with id: ${friendId} is not found`)
      }
      await manager.delete(Friend, {
        userId: friend.friendId,
        friendId: friend.userId
      })
      await manager.delete(Friend, { id: friend.id })
      return friend
    })
  }
}
