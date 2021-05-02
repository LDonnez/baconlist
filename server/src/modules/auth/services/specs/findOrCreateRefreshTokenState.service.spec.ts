import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "./helper"
import { DatabaseService } from "../../../database/database.service"
import { User } from "../../../users/entities/user.entity"
import { RefreshTokenState } from "../../entities/refreshTokenState.entity"
import { FindOrCreateRefreshTokenStateService } from "../findOrCreateRefreshTokenState.service"

describe("FindOrCreateRefreshTokenService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let refreshTokenStateRepository: Repository<RefreshTokenState>
  let findOrCreateRefreshTokenService: FindOrCreateRefreshTokenStateService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    refreshTokenStateRepository = module.get<Repository<RefreshTokenState>>(
      getRepositoryToken(RefreshTokenState)
    )
    findOrCreateRefreshTokenService = module.get<
      FindOrCreateRefreshTokenStateService
    >(FindOrCreateRefreshTokenStateService)
  })

  it("should be defined", () => {
    expect(findOrCreateRefreshTokenService).toBeDefined()
  })

  it("should successfully create a new refresh token because it does not exist yet", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })

    const result = await findOrCreateRefreshTokenService.execute(
      user.id,
      "test"
    )
    expect(result).toBeDefined()
  })

  it("should successfully return the existing refresh token", async () => {
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
    const result = await findOrCreateRefreshTokenService.execute(
      user.id,
      "test"
    )
    expect(result).toBeDefined()
    expect(result).toEqual(refreshTokenState)
  })

  it("should successfully create a new refresh token when another one exists with a different user agent", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    await refreshTokenStateRepository.save({
      userId: user.id,
      userAgent: "other",
      revoked: false
    })
    const result = await findOrCreateRefreshTokenService.execute(
      user.id,
      "test"
    )
    expect(result).toBeDefined()
    expect(result.userAgent).toEqual("test")
  })

  it("should fail finding or creating a refresh token because existing token is revoked", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    await refreshTokenStateRepository.save({
      userId: user.id,
      userAgent: "test",
      revoked: true
    })
    try {
      const result = await findOrCreateRefreshTokenService.execute(
        user.id,
        "test"
      )
      expect(result).toBeUndefined()
    } catch (e) {
      expect(e).toBeDefined()
    }
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
