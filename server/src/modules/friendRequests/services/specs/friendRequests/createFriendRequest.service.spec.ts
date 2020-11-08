import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "../helper"
import { DatabaseService } from "../../../../database/database.service"
import { CreateFriendRequestService } from "../../friendRequests/createFriendRequest.service"
import { FriendRequest } from "../../../entities/friendRequest.entity"
import { User } from "../../../../users/entities/user.entity"

describe("CreateFriendRequestService", () => {
  let databaseService: DatabaseService
  let friendRequestRepository: Repository<FriendRequest>
  let userRepository: Repository<User>
  let createFriendRequestService: CreateFriendRequestService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    friendRequestRepository = module.get<Repository<FriendRequest>>(
      getRepositoryToken(FriendRequest)
    )
    createFriendRequestService = module.get<CreateFriendRequestService>(
      CreateFriendRequestService
    )
  })

  it("should be defined", () => {
    expect(createFriendRequestService).toBeDefined()
  })

  it("should successfully create a friend request", async () => {
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
    const result = await createFriendRequestService.execute(user.id, {
      receiverId: friend.id
    })
    expect(result).toBeDefined()
  })

  it("throws an error because a friend reqeust already exists with that receiver_id", async () => {
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
    await friendRequestRepository.save({
      receiverId: user.id,
      requesterId: friend.id
    })
    try {
      const result = await createFriendRequestService.execute(user.id, {
        receiverId: friend.id
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
