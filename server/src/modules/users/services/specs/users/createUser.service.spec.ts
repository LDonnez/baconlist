import { bootstrapTestingModule } from "../helper"
import { CreateUserService } from "../../users/createUser.service"
import { PrismaService } from "../../../../prisma/prisma.service"
import { BadRequestException } from "@nestjs/common"
import { TestingModule } from "@nestjs/testing"

describe("CreateUserService", () => {
  let module: TestingModule
  let prismaService: PrismaService
  let createUserService: CreateUserService

  beforeAll(async () => {
    module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    createUserService = module.get<CreateUserService>(CreateUserService)
  })

  it("should be defined", () => {
    expect(createUserService).toBeDefined()
  })

  it("should successfully create a user", async () => {
    const result = await createUserService.execute({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test",
      passwordConfirmation: "test"
    })
    expect(result).toBeDefined()
    expect(result.email).toEqual("test@test.com")
  })

  it("throws an error because user with that email already exists", async () => {
    await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })
    await expect(
      createUserService.execute({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test",
        passwordConfirmation: "test"
      })
    ).rejects.toThrowError(BadRequestException)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await module.close()
  })
})
