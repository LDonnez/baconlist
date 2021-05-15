import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "../../prisma/prisma.service"
import { RefreshTokenState } from "@prisma/client"

@Injectable()
export class GetRefreshTokenStateByIdService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService
  ) {}

  public async execute(id: string): Promise<RefreshTokenState> {
    const refreshTokenState = await this.getRefreshTokenStateById(id)
    if (!refreshTokenState) {
      throw new UnauthorizedException("not allowed")
    }
    return refreshTokenState
  }

  private async getRefreshTokenStateById(
    id: string
  ): Promise<RefreshTokenState | null> {
    return await this.prismaService.refreshTokenState.findFirst({
      where: { id }
    })
  }
}
