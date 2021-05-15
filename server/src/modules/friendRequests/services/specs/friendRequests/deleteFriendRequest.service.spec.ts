import { bootstrapTestingModule } from "../helper"
import { DeleteFriendRequestService } from "../../friendRequests/deleteFriendRequest.service"
import { PrismaService } from "../../../../prisma/prisma.service"
import { NotFoundException } from "@nestjs/common"

describe("DeleteFriendRequestService", () => {
  let prismaService: PrismaService
  let deleteFriendRequestService: DeleteFriendRequestService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)

    deleteFriendRequestService = module.get<DeleteFriendRequestService>(
      DeleteFriendRequestService
    )
  })

  it("should be defined", () => {
    expect(deleteFriendRequestService).toBeDefined()
  })

  it("should successfully delete a friend request", async () => {
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
        receiverId: user.id,
        requesterId: friend.id
      }
    })
    const result = await deleteFriendRequestService.execute(
      user.id,
      friendRequest.id
    )
    expect(result).toBeDefined()
  })

  it("should throw not found exception when friend request does not exist", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })
    await expect(
      deleteFriendRequestService.execute(
        user.id,
        "087b22fa-69da-4594-baf4-bec5a8952237"
      )
    ).rejects.toThrowError(NotFoundException)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
