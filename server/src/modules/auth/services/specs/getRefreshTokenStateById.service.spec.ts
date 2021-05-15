import { bootstrapTestingModule } from "./helper"
import { PrismaService } from "../../../prisma/prisma.service"
import { GetRefreshTokenStateByIdService } from "../getRefreshTokenStateById.service"
import { UnauthorizedException } from "@nestjs/common"

describe("GetRefreshTokenStateByIdService", () => {
  let prismaService: PrismaService
  let getRefreshTokenStateByIdService: GetRefreshTokenStateByIdService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    getRefreshTokenStateByIdService = module.get<
      GetRefreshTokenStateByIdService
    >(GetRefreshTokenStateByIdService)
  })

  it("should be defined", () => {
    expect(getRefreshTokenStateByIdService).toBeDefined()
  })

  it("should successfully get a refresh token state by id", async () => {
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

    const result = await getRefreshTokenStateByIdService.execute(
      refreshTokenState.id
    )
    expect(result).toBeDefined()
  })

  it("should not get a refresh token state by id because it does not exist", async () => {
    await expect(
      getRefreshTokenStateByIdService.execute(
        "69166027-ba03-40ac-8e31-bc12091eeb2f"
      )
    ).rejects.toThrowError(UnauthorizedException)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
