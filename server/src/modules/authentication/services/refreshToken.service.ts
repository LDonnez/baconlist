import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { GetUserByIdService } from "../../users/services/users/getUserById.service"
import { BuildAccessTokenService } from "./buildAccessToken.service"
import { BuildCookieWithRefreshTokenService } from "./buildCookieWithRefreshToken.service"
import { BuildRefreshTokenService } from "./buildRefreshToken.service"
import { GetRefreshTokenStateByIdService } from "./getRefreshTokenStateById.service"

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(GetRefreshTokenStateByIdService)
    private readonly getRefreshTokenByIdService: GetRefreshTokenStateByIdService,
    @Inject(GetUserByIdService)
    private readonly getUserByIdService: GetUserByIdService,
    @Inject(BuildAccessTokenService)
    private readonly buildAccessTokenService: BuildAccessTokenService,
    @Inject(BuildRefreshTokenService)
    private readonly buildRefreshTokenService: BuildRefreshTokenService,
    @Inject(BuildCookieWithRefreshTokenService)
    private readonly buildCookieWithRefreshTokenService: BuildCookieWithRefreshTokenService
  ) {}

  public async execute(
    refreshToken: string
  ): Promise<{ refreshToken: string, accessToken: string, cookie: string }> {
    const { sub } = await this.verifyToken(refreshToken)
    const refreshTokenState = await this.getRefreshTokenByIdService.execute(sub)
    if (refreshTokenState.revoked) {
      throw new UnauthorizedException("not allowed")
    }
    const newRefreshToken = await this.buildRefreshTokenService.execute(
      refreshTokenState
    )
    const user = await this.getUserByIdService.execute(refreshTokenState.userId)
    const accessToken = await this.buildAccessTokenService.execute(user)
    const cookie = this.buildCookieWithRefreshTokenService.execute(refreshToken)
    return {
      refreshToken: newRefreshToken,
      accessToken,
      cookie
    }
  }

  private async verifyToken(refreshToken: string): Promise<{ sub: string }> {
    try {
      return await this.jwtService.verifyAsync(refreshToken)
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }
}
