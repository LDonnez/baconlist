import { bootstrapTestingModule } from "./helper"
import { RefreshTokenService } from "../refreshToken.service"
import { BuildRefreshTokenService } from "../buildRefreshToken.service"
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "../../../prisma/prisma.service"
import { UnauthorizedException } from "@nestjs/common"

describe("RefreshTokenService", () => {
  let prismaService: PrismaService
  let refreshTokenService: RefreshTokenService
  let buildRefreshTokenService: BuildRefreshTokenService
  let jwtService: JwtService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService)
    buildRefreshTokenService = module.get<BuildRefreshTokenService>(
      BuildRefreshTokenService
    )

    jwtService = module.get<JwtService>(JwtService)
  })

  it("should be defined", () => {
    expect(refreshTokenService).toBeDefined()
  })

  it("should successfully refresh the token", async () => {
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
        revoked: false,
        userAgent: "test"
      }
    })
    const refreshToken = await buildRefreshTokenService.execute(
      refreshTokenState
    )

    const result = await refreshTokenService.execute(refreshToken)
    expect(result).toBeDefined()
  })

  it("should fail refreshing the token because refresh token state is revoked", async () => {
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
        revoked: true,
        userAgent: "test"
      }
    })
    const refreshToken = await buildRefreshTokenService.execute(
      refreshTokenState
    )
    await expect(
      refreshTokenService.execute(refreshToken)
    ).rejects.toThrowError(UnauthorizedException)
  })

  it("should fail refreshing the token because refresh token is expired", async () => {
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
        revoked: false,
        userAgent: "test"
      }
    })
    const refreshToken = jwtService.sign(
      { sub: refreshTokenState.id },
      { expiresIn: -10 }
    )
    await expect(
      refreshTokenService.execute(refreshToken)
    ).rejects.toThrowError(UnauthorizedException)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
