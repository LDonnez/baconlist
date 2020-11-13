import {
  Controller,
  Post,
  Body,
  UsePipes,
  Inject,
  Res,
  HttpCode,
  Headers,
  ValidationPipe
} from "@nestjs/common"
import { Response } from "express"
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse
} from "@nestjs/swagger"
import { AuthenticationDto } from "../dto/authentication.dto"
import { AuthenticationResultDto } from "../dto/authenticationResult.dto"
import { AuthenticateService } from "../services/authenticate.service"
import { BuildCookieWithRefreshTokenService } from "../services/buildCookieWithRefreshToken.service"
import { FindOrCreateRefreshTokenStateService } from "../services/findOrCreateRefreshTokenState.service"
import { BuildAccessTokenService } from "../services/buildAccessToken.service"
import { BuildRefreshTokenService } from "../services/buildRefreshToken.service"

@ApiTags("Authentication")
@Controller("auth")
export class AuthenticationController {
  constructor(
    @Inject(AuthenticateService)
    private readonly authenticateService: AuthenticateService,
    @Inject(FindOrCreateRefreshTokenStateService)
    private readonly findOrCreateRefreshTokenStateService: FindOrCreateRefreshTokenStateService,
    @Inject(BuildCookieWithRefreshTokenService)
    private readonly buildCookieWithRefreshTokenService: BuildCookieWithRefreshTokenService,
    @Inject(BuildAccessTokenService)
    private readonly buildAccessTokenService: BuildAccessTokenService,
    @Inject(BuildRefreshTokenService)
    private readonly buildRefreshTokenService: BuildRefreshTokenService
  ) {}

  @ApiOperation({ description: "authenticates a user with email and password" })
  @ApiOkResponse({
    description: "user successfully authenticated",
    type: AuthenticationResultDto
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @Post("/token")
  @HttpCode(200)
  public async create(
    @Body() userData: AuthenticationDto,
    @Res() response: Response,
    @Headers("user-agent") userAgent?: string
  ): Promise<Response<AuthenticationResultDto>> {
    const user = await this.authenticateService.execute(userData)
    const refreshTokenData = await this.findOrCreateRefreshTokenStateService.execute(
      user.id,
      userAgent ?? "unknown"
    )
    const refreshToken = await this.buildRefreshTokenService.execute(
      refreshTokenData
    )
    const cookie = this.buildCookieWithRefreshTokenService.execute(refreshToken)
    const accessToken = await this.buildAccessTokenService.execute(user)
    response.setHeader("Set-Cookie", cookie)
    return response.send({ accessToken, refreshToken })
  }
}
