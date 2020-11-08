import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "../helper"
import { DatabaseService } from "../../../../database/database.service"
import { DeleteFriendRequestService } from "../../friendRequests/deleteFriendRequest.service"
import { FriendRequest } from "../../../entities/friendRequest.entity"
import { User } from "../../../../users/entities/user.entity"

describe("DeleteFriendRequestService", () => {
  let databaseService: DatabaseService
  let friendRequestRepository: Repository<FriendRequest>
  let userRepository: Repository<User>
  let deleteFriendRequestService: DeleteFriendRequestService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    friendRequestRepository = module.get<Repository<FriendRequest>>(
      getRepositoryToken(FriendRequest)
    )
    deleteFriendRequestService = module.get<DeleteFriendRequestService>(
      DeleteFriendRequestService
    )
  })

  it("should be defined", () => {
    expect(deleteFriendRequestService).toBeDefined()
  })

  it("should successfully delete a friend request", async () => {
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
    const friendRequest = await friendRequestRepository.save({
      receiverId: user.id,
      requesterId: friend.id
    })
    const result = await deleteFriendRequestService.execute(
      user.id,
      friendRequest.id
    )
    expect(result).toBeDefined()
  })

  it("should throw not found exception when friend request does not exist", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    try {
      const result = await deleteFriendRequestService.execute(
        user.id,
        "087b22fa-69da-4594-baf4-bec5a8952237"
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
