/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as request from "supertest"
import { INestApplication } from "@nestjs/common"
import { bootstrapTestApp, bootstrapTestingModule } from "./helper"
import { hash } from "bcrypt"
import { PrismaService } from "../../../prisma/prisma.service"

describe("Auth Controller", () => {
  let app: INestApplication
  let prismaService: PrismaService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()

    app = bootstrapTestApp(module)
    await app.init()

    prismaService = module.get<PrismaService>(PrismaService)
  })

  it("app should be defined", () => {
    expect(app).toBeDefined()
  })

  describe("/POST", () => {
    it("/POST /auth/token successfully authenticates a user ", async () => {
      const user = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: await hash("test", 10)
        }
      })
      const response = await request(app.getHttpServer())
        .post("/auth/token")
        .set("user-agent", "test")
        .send({
          email: user.email,
          password: "test"
        })
      expect(response.body).toBeDefined()
      expect(response.header["set-cookie"]).toHaveLength(2)
    })

    it("/POST /auth/token fails authenticating a user because password is wrong", async () => {
      const user = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: await hash("test", 10)
        }
      })
      const response = await request(app.getHttpServer())
        .post("/auth/token")
        .set("user-agent", "test")
        .send({
          email: user.email,
          password: "wrongpassword"
        })
        .expect(401)
      expect(response.body).toBeDefined()
      expect(response.header["set-cookie"]).toBeUndefined()
    })

    it("/POST /auth/token fails authenticating a user because user is not found with email", async () => {
      await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: await hash("test", 10)
        }
      })
      const response = await request(app.getHttpServer())
        .post("/auth/token")
        .set("user-agent", "test")
        .send({
          email: "email@notexists.com",
          password: "test"
        })
        .expect(401)
      expect(response.body).toBeDefined()
      expect(response.header["set-cookie"]).toBeUndefined()
    })

    it("/POST /auth/token fails authenticating a user because refresh token is revoked", async () => {
      const user = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: await hash("test", 10)
        }
      })

      await prismaService.refreshTokenState.create({
        data: {
          userId: user.id,
          userAgent: "test",
          revoked: true
        }
      })
      const response = await request(app.getHttpServer())
        .post("/auth/token")
        .set("user-agent", "test")
        .send({
          email: "test@test.com",
          password: "test"
        })
        .expect(401)
      expect(response.body).toBeDefined()
      expect(response.header["set-cookie"]).toBeUndefined()
    })
  })

  afterEach(async () => {
    await prismaService.cleanAll()
  })

  afterAll(async () => {
    await app.close()
    await prismaService.closeConnection()
  })
})
