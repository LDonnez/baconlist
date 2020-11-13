import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "../helper"
import { DatabaseService } from "../../../../database/database.service"
import { GetUserByEmailService } from "../../users/getUserByEmail.service"
import { User } from "../../../../users/entities/user.entity"

describe("GetUserByEmailService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let getUserByEmailService: GetUserByEmailService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    getUserByEmailService = module.get<GetUserByEmailService>(
      GetUserByEmailService
    )
  })

  it("should be defined", () => {
    expect(getUserByEmailService).toBeDefined()
  })

  it("should successfully get the user by email", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    const result = await getUserByEmailService.execute(user.email)
    expect(result).toBeDefined()
    expect(result.id).toEqual(user.id)
  })

  it("should fail getting the user because it does not exist", async () => {
    try {
      const result = await getUserByEmailService.execute(
        "idonotexist@example.com"
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
