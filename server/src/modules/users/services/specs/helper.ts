import { TestingModule, Test } from "@nestjs/testing"
import { CreateUserService } from "../users/createUser.service"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "../../../prisma/prisma.module"
import { GetUserByIdService } from "../users/getUserById.service"
import { UpdateUserService } from "../users/updateUser.service"
import { GetUserByEmailService } from "../users/getUserByEmail.service"

export async function bootstrapTestingModule(): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      PrismaModule,
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [".env.test"]
      })
    ],
    providers: [
      CreateUserService,
      GetUserByIdService,
      GetUserByEmailService,
      UpdateUserService
    ]
  }).compile()
}
