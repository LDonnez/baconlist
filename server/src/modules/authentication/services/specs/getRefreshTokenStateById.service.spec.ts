import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "./helper"
import { DatabaseService } from "../../../database/database.service"
import { User } from "../../../users/entities/user.entity"
import { RefreshTokenState } from "../../entities/refreshTokenState.entity"
import { GetRefreshTokenStateByIdService } from "../getRefreshTokenStateById.service"

describe("GetRefreshTokenStateByIdService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let refreshTokenStateRepository: Repository<RefreshTokenState>
  let getRefreshTokenStateByIdService: GetRefreshTokenStateByIdService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    getRefreshTokenStateByIdService = module.get<
      GetRefreshTokenStateByIdService
    >(GetRefreshTokenStateByIdService)
    refreshTokenStateRepository = module.get<Repository<RefreshTokenState>>(
      getRepositoryToken(RefreshTokenState)
    )
  })

  it("should be defined", () => {
    expect(getRefreshTokenStateByIdService).toBeDefined()
  })

  it("should successfully get a refresh token state by id", async () => {
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

    const result = await getRefreshTokenStateByIdService.execute(
      refreshTokenState.id
    )
    expect(result).toBeDefined()
  })

  it("should not get a refresh token state by id because it does not exist", async () => {
    try {
      const result = await getRefreshTokenStateByIdService.execute(
        "69166027-ba03-40ac-8e31-bc12091eeb2f"
      )
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
