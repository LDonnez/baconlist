import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Inject,
  Res,
  HttpCode
} from "@nestjs/common"
import { Response } from "express"
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse
} from "@nestjs/swagger"
import { AuthenticateDto } from "../dto/authenticate.dto"
import { AuthenticateService } from "../services/authenticate.service"
import { User } from "../../users/entities/user.entity"
import { BuildCookieService } from "../services/buildCookie.service"

@ApiTags("Authentication")
@Controller("auth")
export class AuthenticationController {
  constructor(
    @Inject(AuthenticateService)
    private readonly authenticateService: AuthenticateService,
    @Inject(BuildCookieService)
    private readonly buildCookieService: BuildCookieService
  ) {}

  @ApiOperation({ description: "authenticates a user with email and password" })
  @ApiOkResponse({ description: "user successfully authenticated", type: User })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @Post("/token")
  @HttpCode(200)
  public async token(
    @Body() userData: AuthenticateDto,
    @Res() response: Response
  ): Promise<Response<User>> {
    const user = await this.authenticateService.execute(userData)
    const cookie = this.buildCookieService.execute(user)
    response.setHeader("Set-Cookie", cookie)
    return response.send(user)
  }
}
