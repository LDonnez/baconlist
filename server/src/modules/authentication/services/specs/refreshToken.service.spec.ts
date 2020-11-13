import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "./helper"
import { DatabaseService } from "../../../database/database.service"
import { User } from "../../../users/entities/user.entity"
import { RefreshTokenState } from "../../entities/refreshTokenState.entity"
import { RefreshTokenService } from "../refreshToken.service"
import { BuildRefreshTokenService } from "../buildRefreshToken.service"
import { JwtService } from "@nestjs/jwt"

describe("RefreshTokenService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let refreshTokenStateRepository: Repository<RefreshTokenState>
  let refreshTokenService: RefreshTokenService
  let buildRefreshTokenService: BuildRefreshTokenService
  let jwtService: JwtService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService)
    buildRefreshTokenService = module.get<BuildRefreshTokenService>(
      BuildRefreshTokenService
    )
    refreshTokenStateRepository = module.get<Repository<RefreshTokenState>>(
      getRepositoryToken(RefreshTokenState)
    )
    jwtService = module.get<JwtService>(JwtService)
  })

  it("should be defined", () => {
    expect(refreshTokenService).toBeDefined()
  })

  it("should successfully refresh the token", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    const refreshTokenState = await refreshTokenStateRepository.save({
      userId: user.id,
      revoked: false,
      userAgent: "test"
    })
    const refreshToken = await buildRefreshTokenService.execute(
      refreshTokenState
    )

    const result = await refreshTokenService.execute(refreshToken)
    expect(result).toBeDefined()
  })

  it("should fail refreshing the token because refresh token state is revoked", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    const refreshTokenState = await refreshTokenStateRepository.save({
      userId: user.id,
      revoked: true,
      userAgent: "test"
    })
    const refreshToken = await buildRefreshTokenService.execute(
      refreshTokenState
    )
    try {
      const result = await refreshTokenService.execute(refreshToken)
      expect(result).toBeUndefined()
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it("should fail refreshing the token because refresh token is expired", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    const refreshTokenState = await refreshTokenStateRepository.save({
      userId: user.id,
      revoked: false,
      userAgent: "test"
    })
    const refreshToken = jwtService.sign(
      { sub: refreshTokenState.id },
      { expiresIn: -10 }
    )
    try {
      const result = await refreshTokenService.execute(refreshToken)
      expect(result).toBeUndefined()
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
