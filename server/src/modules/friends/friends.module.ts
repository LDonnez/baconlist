import { Module } from "@nestjs/common"
import { Friend } from "./entities/friend.entity"
import { DatabaseModule } from "../database/database.module"
import { UsersModule } from "../users/users.module"
import { FriendRequestsModule } from "../friendRequests/friendRequests.module"
import { CreateFriendService } from "./services/friends/createFriend.service"
import { RetrieveFriendsService } from "./services/friends/retrieveFriends.service"
import { DeleteFriendService } from "./services/friends/deleteFriend.service"
import { FriendsController } from "./controllers/friends/friends.controller"
import { ConfigModule } from "@nestjs/config"
import { FriendsGateway } from "./gateways/friends/friends.gateway"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    UsersModule,
    FriendRequestsModule,
    DatabaseModule.forFeature([Friend])
  ],
  providers: [
    CreateFriendService,
    RetrieveFriendsService,
    DeleteFriendService,
    FriendsGateway
  ],
  controllers: [FriendsController]
})
export class FriendsModule {}
