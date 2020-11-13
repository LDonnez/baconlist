import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { RefreshTokenState } from "../entities/refreshTokenState.entity"

@Injectable()
export class BuildRefreshTokenService {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(ConfigService)
    private readonly configService: ConfigService
  ) {}

  public async execute(refreshToken: RefreshTokenState): Promise<string> {
    const refreshTokenExpireTime = this.configService.get<number>(
      "JWT_REFRESH_TOKEN_EXPIRE_TIME"
    )
    const payload = this.buildJwtPayload(refreshToken)
    return await this.jwtService.signAsync(payload, {
      expiresIn: `${refreshTokenExpireTime ?? 604800}s`
    })
  }

  private buildJwtPayload(refreshToken: RefreshTokenState): { sub: string } {
    return { sub: refreshToken.id }
  }
}
