import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "../helper"
import { DatabaseService } from "../../../../database/database.service"
import { GetUserByIdService } from "../../users/getUserById.service"
import { User } from "../../../../users/entities/user.entity"

describe("GetUserByIdService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let getUserByIdService: GetUserByIdService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    getUserByIdService = module.get<GetUserByIdService>(GetUserByIdService)
  })

  it("should be defined", () => {
    expect(getUserByIdService).toBeDefined()
  })

  it("should successfully get the user by id", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    const result = await getUserByIdService.execute(user.id)
    expect(result).toBeDefined()
    expect(result.id).toEqual(user.id)
  })

  it("should fail getting the user because it does not exist", async () => {
    try {
      const result = await getUserByIdService.execute(
        "46b587b4-fcee-4c59-93d2-d0150fc5f573"
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
