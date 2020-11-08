import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "../helper"
import { DatabaseService } from "../../../../database/database.service"
import { CreateUserService } from "../../users/createUser.service"
import { User } from "../../../../users/entities/user.entity"

describe("CreateUserService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let createUserService: CreateUserService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    createUserService = module.get<CreateUserService>(CreateUserService)
  })

  it("should be defined", () => {
    expect(createUserService).toBeDefined()
  })

  it("should successfully create a user", async () => {
    const result = await createUserService.execute({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test",
      passwordConfirmation: "test"
    })
    expect(result).toBeDefined()
    expect(result.email).toEqual("test@test.com")
  })

  it("throws an error because user with that email already exists", async () => {
    await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test",
      passwordConfirmation: "test"
    })
    try {
      const result = await createUserService.execute({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test",
        passwordConfirmation: "test"
      })
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
