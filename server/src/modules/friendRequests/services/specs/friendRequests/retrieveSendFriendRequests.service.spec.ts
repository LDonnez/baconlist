import { bootstrapTestingModule } from "../helper"
import { RetrieveSendFriendRequestsService } from "../../friendRequests/retrieveSendFriendRequests.service"
import { PrismaService } from "../../../../prisma/prisma.service"

describe("RetrieveSendFriendRequestsService", () => {
  let prismaService: PrismaService
  let retrieveSendFriendRequestsService: RetrieveSendFriendRequestsService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)

    retrieveSendFriendRequestsService = module.get<
      RetrieveSendFriendRequestsService
    >(RetrieveSendFriendRequestsService)
  })

  it("should be defined", () => {
    expect(retrieveSendFriendRequestsService).toBeDefined()
  })

  it("should successfully retrieve friend requests", async () => {
    const receiver = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })
    const requester = await prismaService.user.create({
      data: {
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      }
    })
    await prismaService.friendRequest.create({
      data: {
        receiverId: receiver.id,
        requesterId: requester.id
      }
    })
    const result = await retrieveSendFriendRequestsService.execute(requester.id)
    expect(result).toHaveLength(1)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
