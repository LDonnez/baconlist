import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "../helper"
import { DatabaseService } from "../../../../database/database.service"
import { Friend } from "../../../entities/friend.entity"
import { User } from "../../../../users/entities/user.entity"
import { RetrieveFriendsService } from "../../friends/retrieveFriends.service"

describe("RetrieveFriendsService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let friendRepository: Repository<Friend>
  let retrieveFriendsService: RetrieveFriendsService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    friendRepository = module.get<Repository<Friend>>(
      getRepositoryToken(Friend)
    )
    retrieveFriendsService = module.get<RetrieveFriendsService>(
      RetrieveFriendsService
    )
  })

  it("should be defined", () => {
    expect(retrieveFriendsService).toBeDefined()
  })

  it("should successfully retrieve all the friends from a user", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    const friend = await userRepository.save({
      firstName: "test2",
      lastName: "test2",
      email: "test2@test.com",
      password: "test"
    })
    await friendRepository.save({ userId: user.id, friendId: friend.id })
    const result = await retrieveFriendsService.execute(user.id)
    expect(result).toBeDefined()
    expect(result).toHaveLength(1)
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
