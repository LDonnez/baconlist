import { TestingModule, Test } from "@nestjs/testing"
import { DatabaseModule } from "../../../database/database.module"
import { DatabaseService } from "../../../database/database.service"
import { RefreshTokenState } from "../../entities/refreshTokenState.entity"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { BuildCookieWithRefreshTokenService } from "../buildCookieWithRefreshToken.service"
import { AuthenticateService } from "../authenticate.service"
import { UsersModule } from "../../../users/users.module"
import { FindOrCreateRefreshTokenStateService } from "../findOrCreateRefreshTokenState.service"
import { BuildAccessTokenService } from "../buildAccessToken.service"
import { JwtModule } from "@nestjs/jwt"
import { BuildRefreshTokenService } from "../buildRefreshToken.service"
import { RefreshTokenService } from "../refreshToken.service"
import { GetRefreshTokenStateByIdService } from "../getRefreshTokenStateById.service"

export async function bootstrapTestingModule(): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      UsersModule,
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [".env.test"]
      }),
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
      DatabaseModule.forRoot(),
      DatabaseModule.forFeature([RefreshTokenState])
    ],
    providers: [
      BuildCookieWithRefreshTokenService,
      AuthenticateService,
      DatabaseService,
      FindOrCreateRefreshTokenStateService,
      BuildAccessTokenService,
      BuildRefreshTokenService,
      GetRefreshTokenStateByIdService,
      RefreshTokenService
    ]
  }).compile()
}
