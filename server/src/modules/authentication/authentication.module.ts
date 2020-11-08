import { Module } from "@nestjs/common"
import { UsersModule } from "../users/users.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { BuildCookieService } from "./services/buildCookie.service"
import { AuthenticateService } from "./services/authenticate.service"
import { AuthenticationController } from "./controllers/authentication.controller"
import { JwtStrategy } from "./strategies/jwt.strategy"

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: `${configService.get<string>("JWT_EXPIRE_TIME") ?? 3800}s`
        }
      })
    })
  ],
  controllers: [AuthenticationController],
  providers: [BuildCookieService, AuthenticateService, JwtStrategy],
  exports: [BuildCookieService, JwtModule]
})
export class AuthenticationModule {}
