import { bootstrapTestingModule } from "./helper"
import { PrismaService } from "../../../prisma/prisma.service"
import { BuildCookieWithRefreshTokenService } from "../buildCookieWithRefreshToken.service"
import { BuildRefreshTokenService } from "../buildRefreshToken.service"

describe("BuildCookieWithRefreshTokenService", () => {
  let prismaService: PrismaService
  let buildCookieWithRefreshTokenService: BuildCookieWithRefreshTokenService
  let buildRefreshTokenService: BuildRefreshTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)

    buildRefreshTokenService = module.get<BuildRefreshTokenService>(
      BuildRefreshTokenService
    )
    buildCookieWithRefreshTokenService = module.get<
      BuildCookieWithRefreshTokenService
    >(BuildCookieWithRefreshTokenService)
  })

  it("should be defined", () => {
    expect(buildCookieWithRefreshTokenService).toBeDefined()
  })

  it("should successfully build a cookie with a refresh token", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })

    const refreshTokenState = await prismaService.refreshTokenState.create({
      data: {
        userId: user.id,
        userAgent: "test",
        revoked: false
      }
    })

    const refreshToken = await buildRefreshTokenService.execute(
      refreshTokenState
    )

    const result = buildCookieWithRefreshTokenService.execute(refreshToken)
    expect(result).toBeDefined()
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
