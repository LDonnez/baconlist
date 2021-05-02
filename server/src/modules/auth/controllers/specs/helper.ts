import { Test, TestingModule } from "@nestjs/testing"
import { DatabaseModule } from "../../../database/database.module"
import { INestApplication } from "@nestjs/common"
import { User } from "../../../users/entities/user.entity"
import { AuthModule } from "../../auth.module"
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
      AuthModule,
      DatabaseModule.forFeature([User])
    ]
  }).compile()
}

export function bootstrapTestApp(moduleRef: TestingModule): INestApplication {
  const app = moduleRef.createNestApplication()
  app.use(cookieParser())
  return app
}
