import { bootstrapTestingModule } from "../helper"
import { CreateFriendRequestService } from "../../friendRequests/createFriendRequest.service"
import { PrismaService } from "../../../../prisma/prisma.service"
import { BadRequestException } from "@nestjs/common"

describe("CreateFriendRequestService", () => {
  let prismaService: PrismaService
  let createFriendRequestService: CreateFriendRequestService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    createFriendRequestService = module.get<CreateFriendRequestService>(
      CreateFriendRequestService
    )
  })

  it("should be defined", () => {
    expect(createFriendRequestService).toBeDefined()
  })

  it("should successfully create a friend request", async () => {
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
    const result = await createFriendRequestService.execute(user.id, {
      receiverId: friend.id
    })
    expect(result).toBeDefined()
  })

  it("throws an error because a friend request already exists with that receiver_id", async () => {
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
        receiverId: friend.id,
        requesterId: user.id
      }
    })
    await expect(
      createFriendRequestService.execute(user.id, {
        receiverId: friend.id
      })
    ).rejects.toThrowError(BadRequestException)
  })

  it("throws an error because a friend already exists with that userId", async () => {
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
    await prismaService.friend.create({
      data: {
        userId: user.id,
        friendId: friend.id
      }
    })
    await expect(
      createFriendRequestService.execute(user.id, {
        receiverId: friend.id
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
