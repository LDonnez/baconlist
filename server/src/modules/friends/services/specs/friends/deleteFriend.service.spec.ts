import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "../helper"
import { DatabaseService } from "../../../../database/database.service"
import { DeleteFriendService } from "../../friends/deleteFriend.service"
import { Friend } from "../../../entities/friend.entity"
import { User } from "../../../../users/entities/user.entity"

describe("DeleteFriendService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let friendRepository: Repository<Friend>
  let deleteFriendService: DeleteFriendService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    friendRepository = module.get<Repository<Friend>>(
      getRepositoryToken(Friend)
    )
    deleteFriendService = module.get<DeleteFriendService>(DeleteFriendService)
  })

  it("should be defined", () => {
    expect(deleteFriendService).toBeDefined()
  })

  it("should successfully delete friends", async () => {
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
    const f = await friendRepository.save({
      userId: user.id,
      friendId: friend.id
    })
    await friendRepository.save({ userId: friend.id, friendId: user.id })
    const result = await deleteFriendService.execute(user.id, f.id)
    expect(result).toBeDefined()
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
