import { TestingModule, Test } from "@nestjs/testing"
import { CreateFriendRequestService } from "../friendRequests/createFriendRequest.service"
import { RetrieveFriendRequestsService } from "../friendRequests/retrieveFriendRequests.service"
import { UsersModule } from "../../../users/users.module"
import { DeleteFriendRequestService } from "../friendRequests/deleteFriendRequest.service"
import { RetrieveSendFriendRequestsService } from "../friendRequests/retrieveSendFriendRequests.service"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "../../../prisma/prisma.module"

export async function bootstrapTestingModule(): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [".env.test"]
      }),
      UsersModule,
      PrismaModule
    ],
    providers: [
      CreateFriendRequestService,
      RetrieveFriendRequestsService,
      DeleteFriendRequestService,
      RetrieveSendFriendRequestsService
    ]
  }).compile()
}
