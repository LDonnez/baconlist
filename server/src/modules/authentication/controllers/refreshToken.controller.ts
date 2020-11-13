import {
  Controller,
  Post,
  UsePipes,
  Inject,
  Res,
  HttpCode,
  ValidationPipe,
  Req,
  UnauthorizedException
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

@ApiTags("Authentication")
@Controller("auth")
export class RefreshTokenController {
  constructor(
    @Inject(RefreshTokenService)
    private readonly refreshTokenService: RefreshTokenService
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
    @Req() request: Request
  ): Promise<Response<AuthenticationResultDto>> {
    const refreshTokenFromRequest = this.getRefreshTokenFromRequest(request)
    if (!refreshTokenFromRequest) {
      throw new UnauthorizedException("not allowed")
    }
    const {
      refreshToken,
      accessToken,
      cookie
    } = await this.refreshTokenService.execute(refreshTokenFromRequest)
    response.setHeader("Set-Cookie", cookie)
    return response.send({ accessToken, refreshToken })
  }

  private getRefreshTokenFromRequest(request: Request): string | undefined {
    const body: { refreshToken?: string } = request.body as {
      refreshToken?: string
    }
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
}
