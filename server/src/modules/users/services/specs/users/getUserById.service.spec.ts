import { bootstrapTestingModule } from "../helper"
import { GetUserByIdService } from "../../users/getUserById.service"
import { PrismaService } from "../../../../prisma/prisma.service"
import { NotFoundException } from "@nestjs/common"

describe("GetUserByIdService", () => {
  let prismaService: PrismaService
  let getUserByIdService: GetUserByIdService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    getUserByIdService = module.get<GetUserByIdService>(GetUserByIdService)
  })

  it("should be defined", () => {
    expect(getUserByIdService).toBeDefined()
  })

  it("should successfully get the user by id", async () => {
    const user = await prismaService.user.create({
      data: {
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      }
    })
    const result = await getUserByIdService.execute(user.id)
    expect(result).toBeDefined()
    expect(result.id).toEqual(user.id)
  })

  it("should fail getting the user because it does not exist", async () => {
    await expect(
      getUserByIdService.execute("46b587b4-fcee-4c59-93d2-d0150fc5f573")
    ).rejects.toThrowError(NotFoundException)
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await prismaService.closeConnection()
  })
})
