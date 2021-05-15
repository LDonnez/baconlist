import { bootstrapTestingModule } from "../helper"
import { CreateFriendService } from "../../friends/createFriend.service"
import { PrismaService } from "../../../../prisma/prisma.service"
import { BadRequestException } from "@nestjs/common"

describe("CreateFriendService", () => {
  let prismaService: PrismaService
  let createFriendService: CreateFriendService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)

    createFriendService = module.get<CreateFriendService>(CreateFriendService)
  })

  it("should be defined", () => {
    expect(createFriendService).toBeDefined()
  })

  it("should successfully create a friend", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })
    const friend = await prismaService.user.create({
      data: {
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      }
    })
    const friendRequest = await prismaService.friendRequest.create({
      data: {
        requesterId: user.id,
        receiverId: friend.id
      }
    })
    const result = await createFriendService.execute(user.id, {
      friendId: friend.id
    })
    const friendForReceiver = await prismaService.friend.findFirst({
      where: {
        userId: friend.id,
        friendId: user.id
      }
    })
    const deletedFriendRequest = await prismaService.friendRequest.findFirst({
      where: {
        id: friendRequest.id
      }
    })
    expect(result).toBeDefined()
    expect(friendForReceiver).toBeNull()
    expect(deletedFriendRequest).toBeNull()
  })

  it("should throw error because no friend request exist", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })
    const friend = await prismaService.user.create({
      data: {
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      }
    })
    await expect(
      createFriendService.execute(user.id, {
        friendId: friend.id
      })
    ).rejects.toThrowError(BadRequestException)
  })

  it("should throw error because friend already exist", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })
    const friend = await prismaService.user.create({
      data: {
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      }
    })
    await prismaService.friendRequest.create({
      data: {
        requesterId: user.id,
        receiverId: friend.id
      }
    })
    await prismaService.friend.create({
      data: { userId: user.id, friendId: friend.id }
    })
    await expect(
      createFriendService.execute(user.id, {
        friendId: friend.id
      })
    ).rejects.toThrowError(BadRequestException)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
