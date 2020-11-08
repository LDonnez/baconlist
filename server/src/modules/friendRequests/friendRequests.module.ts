import { Module } from "@nestjs/common"
import { FriendRequest } from "./entities/friendRequest.entity"
import { DatabaseModule } from "../database/database.module"
import { CreateFriendRequestService } from "./services/friendRequests/createFriendRequest.service"
import { RetrieveFriendRequestsService } from "./services/friendRequests/retrieveFriendRequests.service"
import { UsersModule } from "../users/users.module"
import { DeleteFriendRequestService } from "./services/friendRequests/deleteFriendRequest.service"
import { RetrieveSendFriendRequestsService } from "./services/friendRequests/retrieveSendFriendRequests.service"
import { FriendRequestsController } from "./controllers/friendRequests/friendRequests.controller"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    DatabaseModule.forFeature([FriendRequest])
  ],
  controllers: [FriendRequestsController],
  providers: [
    CreateFriendRequestService,
    RetrieveFriendRequestsService,
    DeleteFriendRequestService,
    RetrieveSendFriendRequestsService
  ],
  exports: [DatabaseModule]
})
export class FriendRequestsModule {}