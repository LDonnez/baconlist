import { Injectable, Inject, UnauthorizedException } from "@nestjs/common"
import { GetUserByIdService } from "../../users/services/users/getUserById.service"
import { PrismaService } from "../../prisma/prisma.service"
import { RefreshTokenState } from "@prisma/client"

@Injectable()
export class FindOrCreateRefreshTokenStateService {
  constructor(
    @Inject(GetUserByIdService)
    private readonly getUserByIdService: GetUserByIdService,
    @Inject(PrismaService)
    private readonly prismaService: PrismaService
  ) {}

  public async execute(
    userId: string,
    userAgent: string
  ): Promise<RefreshTokenState> {
    const user = await this.getUserByIdService.execute(userId)
    const refreshTokenState = await this.getRefreshTokenStateByUserIdAndUserAgent(
      user.id,
      userAgent
    )
    if (!refreshTokenState) {
      return await this.createRefreshToken(userId, userAgent)
    }

    if (refreshTokenState.revoked) {
      throw new UnauthorizedException("access revoked")
    }
    return refreshTokenState
  }

  private async getRefreshTokenStateByUserIdAndUserAgent(
    userId: string,
    userAgent: string
  ): Promise<RefreshTokenState | null> {
    return await this.prismaService.refreshTokenState.findFirst({
      where: { userId, userAgent }
    })
  }

  private async createRefreshToken(
    userId: string,
    userAgent: string
  ): Promise<RefreshTokenState> {
    return await this.prismaService.refreshTokenState.create({
      data: {
        userAgent,
        userId,
        revoked: false
      }
    })
  }
}
