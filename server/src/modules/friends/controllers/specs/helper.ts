import { Test, TestingModule } from "@nestjs/testing"
import { DatabaseModule } from "../../../../modules/database/database.module"
import { INestApplication } from "@nestjs/common"
import { FriendRequest } from "../../../friendRequests/entities/friendRequest.entity"
import { User } from "../../../users/entities/user.entity"
import { Friend } from "../../entities/friend.entity"
import { FriendsModule } from "../../friends.module"
import { AuthenticationModule } from "../../../authentication/authentication.module"
import * as cookieParser from "cookie-parser"
import { ConfigModule } from "@nestjs/config"

export async function bootstrapTestingModule(): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [".env.test"]
      }),
      DatabaseModule.forRoot(),
      AuthenticationModule,
      FriendsModule,
      DatabaseModule.forFeature([User, FriendRequest, Friend])
    ]
  }).compile()
}

export function bootstrapTestApp(moduleRef: TestingModule): INestApplication {
  const app = moduleRef.createNestApplication()
  app.use(cookieParser())
  return app
}
