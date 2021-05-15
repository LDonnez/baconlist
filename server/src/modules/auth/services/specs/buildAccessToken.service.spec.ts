import { bootstrapTestingModule } from "./helper"
import { PrismaService } from "../../../prisma/prisma.service"
import { BuildAccessTokenService } from "../buildAccessToken.service"

describe("BuildAccessTokenService", () => {
  let prismaService: PrismaService
  let buildAccessTokenService: BuildAccessTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    buildAccessTokenService = module.get<BuildAccessTokenService>(
      BuildAccessTokenService
    )
  })

  it("should be defined", () => {
    expect(buildAccessTokenService).toBeDefined()
  })

  it("should successfully build an access token", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })

    const result = await buildAccessTokenService.execute(user)
    expect(result).toBeDefined()
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
