import { TestingModule, Test } from "@nestjs/testing"
import { UsersModule } from "../../../users/users.module"
import { ConfigModule } from "@nestjs/config"
import { CreateFriendService } from "../friends/createFriend.service"
import { RetrieveFriendsService } from "../friends/retrieveFriends.service"
import { DeleteFriendService } from "../friends/deleteFriend.service"
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
      CreateFriendService,
      RetrieveFriendsService,
      DeleteFriendService
    ]
  }).compile()
}
