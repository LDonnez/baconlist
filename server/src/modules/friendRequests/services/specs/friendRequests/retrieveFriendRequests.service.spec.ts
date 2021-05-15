import { bootstrapTestingModule } from "../helper"
import { RetrieveFriendRequestsService } from "../../friendRequests/retrieveFriendRequests.service"
import { PrismaService } from "../../../../prisma/prisma.service"

describe("RetrieveFriendRequestsService", () => {
  let prismaService: PrismaService
  let retrieveFriendRequestsService: RetrieveFriendRequestsService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    retrieveFriendRequestsService = module.get<RetrieveFriendRequestsService>(
      RetrieveFriendRequestsService
    )
  })

  it("should be defined", () => {
    expect(retrieveFriendRequestsService).toBeDefined()
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
    const result = await retrieveFriendRequestsService.execute(receiver.id)
    expect(result).toHaveLength(1)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
