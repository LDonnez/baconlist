import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "./helper"
import { DatabaseService } from "../../../database/database.service"
import { User } from "../../../users/entities/user.entity"
import { BuildAccessTokenService } from "../buildAccessToken.service"

describe("BuildAccessTokenService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let buildAccessTokenService: BuildAccessTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    buildAccessTokenService = module.get<BuildAccessTokenService>(
      BuildAccessTokenService
    )
  })

  it("should be defined", () => {
    expect(buildAccessTokenService).toBeDefined()
  })

  it("should successfully build an access token", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })

    const result = await buildAccessTokenService.execute(user)
    expect(result).toBeDefined()
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
