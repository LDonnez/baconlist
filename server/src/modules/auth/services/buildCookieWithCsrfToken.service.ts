import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class BuildCookieWithCsrfTokenService {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService
  ) {}

  public execute(csrfToken: string): string {
    const cookieExpireTime = this.getCookieExpireTime()
    return `_csrf=${csrfToken}; Secure; Path=/; SameSite=None; Max-Age=${cookieExpireTime}`
  }

  private getCookieExpireTime(): number {
    const cookieExpireTime = this.configService.get<number>(
      "COOKIE_EXPIRE_TIME"
    )
    return cookieExpireTime ?? 38000
  }
}
