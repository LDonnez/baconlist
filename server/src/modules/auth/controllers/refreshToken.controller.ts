import {
  Controller,
  Post,
  UsePipes,
  Inject,
  Res,
  HttpCode,
  ValidationPipe,
  Req,
  UnauthorizedException,
  Body,
  UseGuards
} from "@nestjs/common"
import { Response } from "express"
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse
} from "@nestjs/swagger"
import { Request } from "express"
import { AuthenticationResultDto } from "../dto/authenticationResult.dto"
import { RefreshTokenService } from "../services/refreshToken.service"
import { RefreshTokenDto } from "../dto/refreshToken.dto"
import { BuildCookieWithCsrfTokenService } from "../services/buildCookieWithCsrfToken.service"
import { BuildCsrfTokenService } from "../services/buildCsrfToken.service"
import { CsrfGuard } from "../guards/csrfGuard"

@ApiTags("Auth")
@Controller("auth")
@UseGuards(CsrfGuard)
export class RefreshTokenController {
  constructor(
    @Inject(RefreshTokenService)
    private readonly refreshTokenService: RefreshTokenService,
    @Inject(BuildCookieWithCsrfTokenService)
    private readonly buildCsrfCookieService: BuildCookieWithCsrfTokenService,
    @Inject(BuildCsrfTokenService)
    private readonly buildCsrfTokenService: BuildCsrfTokenService
  ) {}

  @ApiOperation({ description: "refresh access token" })
  @ApiOkResponse({
    description: "successfully refreshed access token",
    type: AuthenticationResultDto
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @Post("/refresh_token")
  @HttpCode(200)
  public async create(
    @Res() response: Response,
    @Req() request: Request,
    @Body() body: RefreshTokenDto
  ): Promise<Response<AuthenticationResultDto>> {
    const refreshTokenFromRequest = this.getRefreshTokenFromRequest(
      request,
      body
    )
    if (!refreshTokenFromRequest) {
      throw new UnauthorizedException("not allowed")
    }
    const {
      refreshToken,
      accessToken,
      cookie
    } = await this.refreshTokenService.execute(refreshTokenFromRequest)
    const csrfCookie = this.buildCsrfCookie()
    response.setHeader("Set-Cookie", [cookie, csrfCookie])
    return response.send({ accessToken, refreshToken })
  }

  private getRefreshTokenFromRequest(
    request: Request,
    body: RefreshTokenDto
  ): string | undefined {
    if (body.refreshToken) {
      return body.refreshToken
    }
    return this.getRefreshTokenFromCookie(request)
  }

  private getRefreshTokenFromCookie(request: Request): string | undefined {
    const cookies: { refreshToken?: string } = request.cookies as {
      refreshToken?: string
    }
    return cookies["refreshToken"]
  }

  private buildCsrfCookie(): string {
    const csrfCookie = this.buildCsrfTokenService.execute()
    return this.buildCsrfCookieService.execute(csrfCookie)
  }
}
