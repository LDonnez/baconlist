import { Injectable } from "@nestjs/common"
import { User } from "../../users/entities/user.entity"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class BuildCookieService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  public execute(user: User): string {
    const payload = this.buildJwtPayload(user)
    const token = this.jwtService.sign(payload)
    const jwtExpireTime = this.configService.get<string>("JWT_EXPIRE_TIME")
    return `accessToken=${token}; HttpOnly; Path=/; Max-Age=${
      jwtExpireTime ?? 3800
    }`
  }

  private buildJwtPayload(user: User): { sub: string } {
    return { sub: user.id }
  }
}
