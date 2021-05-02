import { Injectable, UnauthorizedException } from "@nestjs/common"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { RefreshTokenState } from "../entities/refreshTokenState.entity"

@Injectable()
export class GetRefreshTokenStateByIdService {
  constructor(
    @InjectRepository(RefreshTokenState)
    private readonly refreshTokenRepository: Repository<RefreshTokenState>
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
  ): Promise<RefreshTokenState | undefined> {
    return await this.refreshTokenRepository.findOne({ id })
  }
}
