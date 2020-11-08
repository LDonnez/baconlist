import { TestingModule, Test } from "@nestjs/testing"
import { DatabaseModule } from "../../../../modules/database/database.module"
import { DatabaseService } from "../../../database/database.service"
import { User } from "../../entities/user.entity"
import { CreateUserService } from "../users/createUser.service"
import { GetUserByEmailService } from "../users/getUserByEmail.service"
import { ConfigModule } from "@nestjs/config"

export async function bootstrapTestingModule(): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [".env.test"]
      }),
      DatabaseModule.forRoot(),
      DatabaseModule.forFeature([User])
    ],
    providers: [CreateUserService, GetUserByEmailService, DatabaseService]
  }).compile()
}
