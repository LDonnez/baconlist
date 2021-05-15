import { bootstrapTestingModule } from "./helper"
import { PrismaService } from "../../../prisma/prisma.service"
import { hash } from "bcrypt"
import { AuthenticateService } from "../authenticate.service"
import { UnauthorizedException } from "@nestjs/common"

describe("AuthenticateService", () => {
  let prismaService: PrismaService
  let authenticateService: AuthenticateService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    authenticateService = module.get<AuthenticateService>(AuthenticateService)
  })

  it("should be defined", () => {
    expect(authenticateService).toBeDefined()
  })

  it("should successfully authenticate the user", async () => {
    await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: await hash("test", 10)
      }
    })

    const result = await authenticateService.execute({
      email: "test@test.com",
      password: "test"
    })
    expect(result).toBeDefined()
  })

  it("should fail authenticating the user because password is wrong", async () => {
    await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: await hash("test", 10)
      }
    })
    await expect(
      authenticateService.execute({
        email: "test@test.com",
        password: "wrong"
      })
    ).rejects.toThrowError(UnauthorizedException)
  })

  it("should fail authenticating the user because user with that email is not found", async () => {
    await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: await hash("test", 10)
      }
    })
    await expect(
      authenticateService.execute({
        email: "notfound@test.com",
        password: "test"
      })
    ).rejects.toThrowError(UnauthorizedException)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
