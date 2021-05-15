import { bootstrapTestingModule } from "./helper"
import { FindOrCreateRefreshTokenStateService } from "../findOrCreateRefreshTokenState.service"
import { PrismaService } from "../../../prisma/prisma.service"
import { UnauthorizedException } from "@nestjs/common"

describe("FindOrCreateRefreshTokenService", () => {
  let prismaService: PrismaService
  let findOrCreateRefreshTokenService: FindOrCreateRefreshTokenStateService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    findOrCreateRefreshTokenService = module.get<
      FindOrCreateRefreshTokenStateService
    >(FindOrCreateRefreshTokenStateService)
  })

  it("should be defined", () => {
    expect(findOrCreateRefreshTokenService).toBeDefined()
  })

  it("should successfully create a new refresh token because it does not exist yet", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })

    const result = await findOrCreateRefreshTokenService.execute(
      user.id,
      "test"
    )
    expect(result).toBeDefined()
  })

  it("should successfully return the existing refresh token", async () => {
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
    const result = await findOrCreateRefreshTokenService.execute(
      user.id,
      "test"
    )
    expect(result).toBeDefined()
    expect(result).toEqual(refreshTokenState)
  })

  it("should successfully create a new refresh token when another one exists with a different user agent", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })
    await prismaService.refreshTokenState.create({
      data: {
        userId: user.id,
        userAgent: "other",
        revoked: false
      }
    })
    const result = await findOrCreateRefreshTokenService.execute(
      user.id,
      "test"
    )
    expect(result).toBeDefined()
    expect(result.userAgent).toEqual("test")
  })

  it("should fail finding or creating a refresh token because existing token is revoked", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })
    await prismaService.refreshTokenState.create({
      data: {
        userId: user.id,
        userAgent: "test",
        revoked: true
      }
    })
    await expect(
      findOrCreateRefreshTokenService.execute(user.id, "test")
    ).rejects.toThrowError(UnauthorizedException)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
