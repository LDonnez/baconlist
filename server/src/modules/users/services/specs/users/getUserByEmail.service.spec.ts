import { bootstrapTestingModule } from "../helper"
import { GetUserByEmailService } from "../../users/getUserByEmail.service"
import { PrismaService } from "../../../../prisma/prisma.service"
import { NotFoundException } from "@nestjs/common"

describe("GetUserByEmailService", () => {
  let prismaService: PrismaService
  let getUserByEmailService: GetUserByEmailService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    getUserByEmailService = module.get<GetUserByEmailService>(
      GetUserByEmailService
    )
  })

  it("should be defined", () => {
    expect(getUserByEmailService).toBeDefined()
  })

  it("should successfully get the user by email", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })
    const result = await getUserByEmailService.execute(user.email)
    expect(result).toBeDefined()
    expect(result.id).toEqual(user.id)
  })

  it("should fail getting the user because it does not exist", async () => {
    await expect(
      getUserByEmailService.execute("idonotexist@example.com")
    ).rejects.toThrowError(NotFoundException)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
