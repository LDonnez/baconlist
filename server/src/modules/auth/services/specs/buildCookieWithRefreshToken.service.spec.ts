import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "./helper"
import { DatabaseService } from "../../../database/database.service"
import { User } from "../../../users/entities/user.entity"
import { RefreshTokenState } from "../../entities/refreshTokenState.entity"
import { BuildCookieWithRefreshTokenService } from "../buildCookieWithRefreshToken.service"
import { BuildRefreshTokenService } from "../buildRefreshToken.service"

describe("BuildCookieWithRefreshTokenService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let refreshTokenStateRepository: Repository<RefreshTokenState>
  let buildCookieWithRefreshTokenService: BuildCookieWithRefreshTokenService
  let buildRefreshTokenService: BuildRefreshTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    refreshTokenStateRepository = module.get<Repository<RefreshTokenState>>(
      getRepositoryToken(RefreshTokenState)
    )
    buildRefreshTokenService = module.get<BuildRefreshTokenService>(
      BuildRefreshTokenService
    )
    buildCookieWithRefreshTokenService = module.get<
      BuildCookieWithRefreshTokenService
    >(BuildCookieWithRefreshTokenService)
  })

  it("should be defined", () => {
    expect(buildCookieWithRefreshTokenService).toBeDefined()
  })

  it("should successfully build a cookie with a refresh token", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })

    const refreshTokenState = await refreshTokenStateRepository.save({
      userId: user.id,
      userAgent: "test",
      revoked: false
    })

    const refreshToken = await buildRefreshTokenService.execute(
      refreshTokenState
    )

    const result = buildCookieWithRefreshTokenService.execute(refreshToken)
    expect(result).toBeDefined()
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
