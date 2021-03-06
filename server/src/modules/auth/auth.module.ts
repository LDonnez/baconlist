import { Module } from "@nestjs/common"
import { UsersModule } from "../users/users.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { BuildCookieWithRefreshTokenService } from "./services/buildCookieWithRefreshToken.service"
import { AuthenticateService } from "./services/authenticate.service"
import { AuthController } from "./controllers/auth.controller"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { FindOrCreateRefreshTokenStateService } from "./services/findOrCreateRefreshTokenState.service"
import { BuildAccessTokenService } from "./services/buildAccessToken.service"
import { RefreshTokenController } from "./controllers/refreshToken.controller"
import { GetRefreshTokenStateByIdService } from "./services/getRefreshTokenStateById.service"
import { BuildRefreshTokenService } from "./services/buildRefreshToken.service"
import { RefreshTokenService } from "./services/refreshToken.service"
import { BuildCookieWithCsrfTokenService } from "./services/buildCookieWithCsrfToken.service"
import { VerifyCsrfTokenService } from "./services/verifyCsrfToken.service"
import { BuildCsrfTokenService } from "./services/buildCsrfToken.service"
import { PrismaModule } from "../prisma/prisma.module"

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
          expiresIn: `${
            configService.get<number>("JWT_ACCESS_TOKEN_EXPIRE_TIME") ?? 3800
          }s`
        }
      })
    }),
    PrismaModule
  ],
  controllers: [AuthController, RefreshTokenController],
  providers: [
    BuildCookieWithRefreshTokenService,
    AuthenticateService,
    JwtStrategy,
    FindOrCreateRefreshTokenStateService,
    BuildAccessTokenService,
    BuildRefreshTokenService,
    GetRefreshTokenStateByIdService,
    BuildCookieWithCsrfTokenService,
    RefreshTokenService,
    VerifyCsrfTokenService,
    BuildCsrfTokenService
  ],
  exports: [BuildAccessTokenService, JwtModule]
})
export class AuthModule {}
