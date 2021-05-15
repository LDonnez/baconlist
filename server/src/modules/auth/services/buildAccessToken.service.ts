import { Inject, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserDto } from "../../users/dto/user.dto"

@Injectable()
export class BuildAccessTokenService {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService
  ) {}

  public async execute(user: UserDto): Promise<string> {
    const payload = this.buildJwtPayload(user)
    return await this.jwtService.signAsync(payload)
  }

  private buildJwtPayload(user: UserDto): { sub: string } {
    return { sub: user.id }
  }
}
