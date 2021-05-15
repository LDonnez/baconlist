import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { FriendsModule } from "../../friends.module"
import { AuthModule } from "../../../auth/auth.module"
import * as cookieParser from "cookie-parser"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "../../../prisma/prisma.module"

export async function bootstrapTestingModule(): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [".env.test"]
      }),
      AuthModule,
      FriendsModule,
      PrismaModule
    ]
  }).compile()
}

export function bootstrapTestApp(moduleRef: TestingModule): INestApplication {
  const app = moduleRef.createNestApplication()
  app.use(cookieParser())
  return app
}
