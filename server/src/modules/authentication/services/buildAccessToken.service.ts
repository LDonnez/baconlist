import { Inject, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User } from "../../users/entities/user.entity"

@Injectable()
export class BuildAccessTokenService {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService
  ) {}

  public async execute(user: User): Promise<string> {
    const payload = this.buildJwtPayload(user)
    return await this.jwtService.signAsync(payload)
  }

  private buildJwtPayload(user: User): { sub: string } {
    return { sub: user.id }
  }
}
