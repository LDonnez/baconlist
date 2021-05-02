import { Injectable, Inject, UnauthorizedException } from "@nestjs/common"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { RefreshTokenState } from "../entities/refreshTokenState.entity"
import { GetUserByIdService } from "../../users/services/users/getUserById.service"

@Injectable()
export class FindOrCreateRefreshTokenStateService {
  constructor(
    @Inject(GetUserByIdService)
    private readonly getUserByIdService: GetUserByIdService,
    @InjectRepository(RefreshTokenState)
    private readonly refreshTokenStateRepository: Repository<RefreshTokenState>
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
  ): Promise<RefreshTokenState | undefined> {
    return await this.refreshTokenStateRepository.findOne({ userId, userAgent })
  }

  private async createRefreshToken(
    userId: string,
    userAgent: string
  ): Promise<RefreshTokenState> {
    const newRefresTokenState = this.buildRefreshTokenState(userId, userAgent)
    return await this.refreshTokenStateRepository.save(newRefresTokenState)
  }

  private buildRefreshTokenState(
    userId: string,
    userAgent: string
  ): RefreshTokenState {
    const newRefresToken = new RefreshTokenState()
    newRefresToken.userId = userId
    newRefresToken.userAgent = userAgent
    newRefresToken.revoked = false
    return newRefresToken
  }
}
