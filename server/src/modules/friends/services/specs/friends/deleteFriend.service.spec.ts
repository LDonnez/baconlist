import { bootstrapTestingModule } from "../helper"
import { DeleteFriendService } from "../../friends/deleteFriend.service"
import { PrismaService } from "../../../../prisma/prisma.service"

describe("DeleteFriendService", () => {
  let prismaService: PrismaService
  let deleteFriendService: DeleteFriendService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    deleteFriendService = module.get<DeleteFriendService>(DeleteFriendService)
  })

  it("should be defined", () => {
    expect(deleteFriendService).toBeDefined()
  })

  it("should successfully delete friends", async () => {
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
    const f = await prismaService.friend.create({
      data: {
        userId: user.id,
        friendId: friend.id
      }
    })
    await prismaService.friend.create({
      data: { userId: friend.id, friendId: user.id }
    })
    const result = await deleteFriendService.execute(user.id, f.id)
    expect(result).toBeDefined()
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
