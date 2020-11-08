import { TestingModule, Test } from "@nestjs/testing"
import { DatabaseModule } from "../../../../modules/database/database.module"
import { DatabaseService } from "../../../database/database.service"
import { FriendRequest } from "../../entities/friendRequest.entity"
import { CreateFriendRequestService } from "../friendRequests/createFriendRequest.service"
import { RetrieveFriendRequestsService } from "../friendRequests/retrieveFriendRequests.service"
import { UsersModule } from "../../../users/users.module"
import { User } from "../../../users/entities/user.entity"
import { DeleteFriendRequestService } from "../friendRequests/deleteFriendRequest.service"
import { RetrieveSendFriendRequestsService } from "../friendRequests/retrieveSendFriendRequests.service"
import { ConfigModule } from "@nestjs/config"

export async function bootstrapTestingModule(): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [".env.test"]
      }),
      UsersModule,
      DatabaseModule.forRoot(),
      DatabaseModule.forFeature([User, FriendRequest])
    ],
    providers: [
      CreateFriendRequestService,
      RetrieveFriendRequestsService,
      DeleteFriendRequestService,
      RetrieveSendFriendRequestsService,
      DatabaseService
    ]
  }).compile()
}
