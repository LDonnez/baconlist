import { bootstrapTestingModule } from "./helper"
import { PrismaService } from "../../../prisma/prisma.service"
import { BuildRefreshTokenService } from "../buildRefreshToken.service"

describe("BuildRefreshTokenService", () => {
  let prismaService: PrismaService
  let buildRefreshTokenService: BuildRefreshTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    buildRefreshTokenService = module.get<BuildRefreshTokenService>(
      BuildRefreshTokenService
    )
  })

  it("should be defined", () => {
    expect(buildRefreshTokenService).toBeDefined()
  })

  it("should successfully build a refresh token", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })
    const refreshToken = await prismaService.refreshTokenState.create({
      data: {
        userId: user.id,
        revoked: false,
        userAgent: "test"
      }
    })

    const result = await buildRefreshTokenService.execute(refreshToken)
    expect(result).toBeDefined()
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
