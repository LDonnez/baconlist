import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, Inject } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { GetUserByIdService } from "../../users/services/users/getUserById.service"
import { TokenPayload } from "../../../types/tokenPayload"
import { UserDto } from "../../users/dto/user.dto"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService) configService: ConfigService,
    @Inject(GetUserByIdService)
    private readonly getUserByIdService: GetUserByIdService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>("JWT_SECRET")
    })
  }

  async validate(payload: TokenPayload): Promise<UserDto> {
    return await this.getUserByIdService.execute(payload.sub)
  }
}
