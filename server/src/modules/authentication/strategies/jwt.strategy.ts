import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, Inject } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Request } from "express"
import { GetUserByIdService } from "../../users/services/users/getUserById.service"
import { TokenPayload } from "../../types/tokenPayload"
import { User } from "../../users/entities/user.entity"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService) configService: ConfigService,
    @Inject(GetUserByIdService)
    private readonly getUserByIdService: GetUserByIdService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          const cookies: { accessToken?: string } = request.cookies as {
            accessToken?: string
          }
          if (cookies.accessToken) {
            return cookies.accessToken
          }
          return null
        }
      ]),
      secretOrKey: configService.get<string>("JWT_SECRET")
    })
  }

  async validate(payload: TokenPayload): Promise<User> {
    return await this.getUserByIdService.execute(payload.sub)
  }
}