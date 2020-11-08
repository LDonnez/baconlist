import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ConfigService } from "@nestjs/config"
import { DatabaseModule } from "../database/database.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { UsersModule } from "../users/users.module"
import { FriendRequestsModule } from "../friendRequests/friendRequests.module"
import { AuthenticationModule } from "../authentication/authentication.module"
import { FriendsModule } from "../friends/friends.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? "development"}`],
      validationOptions: {
        allowUnknown: false,
        abortEarly: true
      }
    }),
    DatabaseModule.forRoot(),
    UsersModule,
    FriendRequestsModule,
    FriendsModule,
    AuthenticationModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  public static port: string | number
  public static apiVersion: string
  public static apiTitle: string
  public static apiDescription: string

  constructor(readonly configService: ConfigService) {
    AppModule.port = configService.get<number>("PORT") as number
    AppModule.apiVersion = configService.get<string>("API_VERSION") as string
    AppModule.apiTitle = configService.get<string>("API_TITLE") as string
    AppModule.apiDescription = configService.get<string>(
      "API_DESCRIPTION"
    ) as string
  }
}
