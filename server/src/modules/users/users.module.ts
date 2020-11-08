import { Module } from "@nestjs/common"
import { User } from "./entities/user.entity"
import { DatabaseModule } from "../database/database.module"
import { UsersController } from "./controllers/users/users.controller"
import { CreateUserService } from "./services/users/createUser.service"
import { GetUserByEmailService } from "./services/users/getUserByEmail.service"
import { GetUserByIdService } from "./services/users/getUserById.service"
import { UpdateUserService } from "./services/users/updateUser.service"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [ConfigModule, DatabaseModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    CreateUserService,
    GetUserByEmailService,
    GetUserByIdService,
    UpdateUserService
  ],
  exports: [GetUserByEmailService, GetUserByIdService]
})
export class UsersModule {}
