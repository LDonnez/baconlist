import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { bootstrapTestingModule } from "../helper"
import { DatabaseService } from "../../../../database/database.service"
import { CreateFriendService } from "../../friends/createFriend.service"
import { FriendRequest } from "../../../../friendRequests/entities/friendRequest.entity"
import { Friend } from "../../../entities/friend.entity"
import { User } from "../../../../users/entities/user.entity"

describe("CreateFriendService", () => {
  let databaseService: DatabaseService
  let friendRequestRepository: Repository<FriendRequest>
  let userRepository: Repository<User>
  let friendRepository: Repository<Friend>
  let createFriendService: CreateFriendService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    friendRequestRepository = module.get<Repository<FriendRequest>>(
      getRepositoryToken(FriendRequest)
    )
    friendRepository = module.get<Repository<Friend>>(
      getRepositoryToken(Friend)
    )
    createFriendService = module.get<CreateFriendService>(CreateFriendService)
  })

  it("should be defined", () => {
    expect(createFriendService).toBeDefined()
  })

  it("should successfully create a friend", async () => {
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
      requesterId: user.id,
      receiverId: friend.id
    })
    const result = await createFriendService.execute(user.id, {
      friendId: friend.id
    })
    const friendForReceiver = await friendRepository.findOne({
      userId: friend.id,
      friendId: user.id
    })
    const deletedFriendRequest = await friendRequestRepository.findOne({
      id: friendRequest.id
    })
    expect(result).toBeDefined()
    expect(friendForReceiver).toBeDefined()
    expect(deletedFriendRequest).toBeUndefined()
  })

  it("should throw error because no friend request exist", async () => {
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
    try {
      const result = await createFriendService.execute(user.id, {
        friendId: friend.id
      })
      expect(result).toBeUndefined()
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it("should throw error because friend already exist", async () => {
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
      requesterId: user.id,
      receiverId: friend.id
    })
    await friendRepository.save({ userId: user.id, friendId: friend.id })
    try {
      const result = await createFriendService.execute(user.id, {
        friendId: friend.id
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
