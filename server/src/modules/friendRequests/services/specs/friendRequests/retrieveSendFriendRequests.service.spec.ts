import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "../helper"
import { DatabaseService } from "../../../../database/database.service"
import { RetrieveSendFriendRequestsService } from "../../friendRequests/retrieveSendFriendRequests.service"
import { FriendRequest } from "../../../entities/friendRequest.entity"
import { User } from "../../../../users/entities/user.entity"

describe("RetrieveSendFriendRequestsService", () => {
  let databaseService: DatabaseService
  let friendRequestRepository: Repository<FriendRequest>
  let userRepository: Repository<User>
  let retrieveSendFriendRequestsService: RetrieveSendFriendRequestsService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    friendRequestRepository = module.get<Repository<FriendRequest>>(
      getRepositoryToken(FriendRequest)
    )
    retrieveSendFriendRequestsService = module.get<
      RetrieveSendFriendRequestsService
    >(RetrieveSendFriendRequestsService)
  })

  it("should be defined", () => {
    expect(retrieveSendFriendRequestsService).toBeDefined()
  })

  it("should successfully retrieve friend requests", async () => {
    const receiver = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    const requester = await userRepository.save({
      firstName: "test2",
      lastName: "test2",
      email: "test2@test.com",
      password: "test"
    })
    await friendRequestRepository.save({
      receiverId: receiver.id,
      requesterId: requester.id
    })
    const result = await retrieveSendFriendRequestsService.execute(requester.id)
    expect(result).toHaveLength(1)
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
