import { bootstrapTestingModule } from "../helper"
import { UpdateUserService } from "../../users/updateUser.service"
import { PrismaService } from "../../../../prisma/prisma.service"
import { BadRequestException } from "@nestjs/common"

describe("UpdateUserService", () => {
  let prismaService: PrismaService
  let updateUserService: UpdateUserService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    updateUserService = module.get<UpdateUserService>(UpdateUserService)
  })

  it("should be defined", () => {
    expect(updateUserService).toBeDefined()
  })

  it("should successfully update the user", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })
    const result = await updateUserService.execute(user.id, {
      firstName: "test2",
      lastName: "test2"
    })
    expect(result).toBeDefined()
    expect(result.id).toEqual(user.id)
    expect(result.firstName).toEqual("test2")
    expect(result.lastName).toEqual("test2")
  })

  it("should fail updating the user because it does not exist", async () => {
    await expect(
      updateUserService.execute("1eb93789-3a36-4050-b75d-a7b0de8e5374", {
        firstName: "test2",
        lastName: "test2"
      })
    ).rejects.toThrowError(BadRequestException)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
