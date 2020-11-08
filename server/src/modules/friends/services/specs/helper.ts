import { TestingModule, Test } from "@nestjs/testing"
import { DatabaseModule } from "../../../../modules/database/database.module"
import { DatabaseService } from "../../../database/database.service"
import { FriendRequest } from "../../../friendRequests/entities/friendRequest.entity"
import { UsersModule } from "../../../users/users.module"
import { User } from "../../../users/entities/user.entity"
import { Friend } from "../../entities/friend.entity"
import { ConfigModule } from "@nestjs/config"
import { CreateFriendService } from "../friends/createFriend.service"
import { RetrieveFriendsService } from "../friends/retrieveFriends.service"
import { DeleteFriendService } from "../friends/deleteFriend.service"

export async function bootstrapTestingModule(): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [".env.test"]
      }),
      DatabaseModule.forRoot(),
      UsersModule,
      DatabaseModule.forFeature([User, FriendRequest, Friend])
    ],
    providers: [
      DatabaseService,
      CreateFriendService,
      RetrieveFriendsService,
      DeleteFriendService
    ]
  }).compile()
}
