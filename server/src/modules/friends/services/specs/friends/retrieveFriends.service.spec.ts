import { bootstrapTestingModule } from "../helper"
import { RetrieveFriendsService } from "../../friends/retrieveFriends.service"
import { PrismaService } from "../../../../prisma/prisma.service"

describe("RetrieveFriendsService", () => {
  let prismaService: PrismaService
  let retrieveFriendsService: RetrieveFriendsService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    retrieveFriendsService = module.get<RetrieveFriendsService>(
      RetrieveFriendsService
    )
  })

  it("should be defined", () => {
    expect(retrieveFriendsService).toBeDefined()
  })

  it("should successfully retrieve all the friends from a user", async () => {
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
      data: { userId: user.id, friendId: friend.id }
    })
    const result = await retrieveFriendsService.execute(user.id)
    expect(result).toBeDefined()
    expect(result).toHaveLength(1)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
