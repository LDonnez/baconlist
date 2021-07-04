/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as request from "supertest"
import { INestApplication } from "@nestjs/common"
import { bootstrapTestApp, bootstrapTestingModule } from "../helper"
import { BuildAccessTokenService } from "../../../../auth/services/buildAccessToken.service"
import { PrismaService } from "../../../../prisma/prisma.service"

describe("Users Controller", () => {
  let app: INestApplication
  let prismaService: PrismaService
  let buildAccessTokenFromUserService: BuildAccessTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    prismaService = module.get<PrismaService>(PrismaService)
    buildAccessTokenFromUserService = module.get<BuildAccessTokenService>(
      BuildAccessTokenService
    )
    app = bootstrapTestApp(module)
    await app.init()
  })

  it("app should be defined", () => {
    expect(app).toBeDefined()
  })

  describe("/POST", () => {
    it("/POST successfully creates a new user", async () => {
      const response = await request(app.getHttpServer())
        .post("/users")
        .send({
          firstName: "test",
          lastName: "test",
          email: "test@example.com",
          password: "test",
          passwordConfirmation: "test"
        })
        .expect(201)
      expect(response.body).toBeDefined()
    })

    it("/POST fails creating a new user because email already exists", async () => {
      await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@example.com",
          password: "test"
        }
      })
      const response = await request(app.getHttpServer())
        .post("/users")
        .send({
          firstName: "test",
          lastName: "test",
          email: "test@example.com",
          password: "test",
          passwordConfirmation: "test"
        })
        .expect(400)
      expect(response.body).toBeDefined()
    })

    it("/POST fails creating a new user because firstName is empty ", async () => {
      const response = await request(app.getHttpServer())
        .post("/users")
        .send({
          firstName: "",
          lastName: "test",
          email: "test@example.com",
          password: "test",
          passwordConfirmation: "test"
        })
        .expect(400)
      expect(response.body).toBeDefined()
    })

    it("/POST fails creating a new user because password does not mach passwordConfirmation", async () => {
      const response = await request(app.getHttpServer())
        .post("/users")
        .send({
          firstName: "test",
          lastName: "test",
          email: "test@example.com",
          password: "test",
          passwordConfirmation: "notmatch"
        })
        .expect(400)
      expect(response.body).toBeDefined()
    })

    it("/POST fails creating a new user because email is not valid", async () => {
      const response = await request(app.getHttpServer())
        .post("/users")
        .send({
          firstName: "test",
          lastName: "test",
          email: "test@notvalid",
          password: "test",
          passwordConfirmation: "test"
        })
        .expect(400)
      expect(response.body).toBeDefined()
    })
  })

  describe("/GET /:id", () => {
    it("/GET successfully gets user by id", async () => {
      const user = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: "test"
        }
      })

      const accessToken = await buildAccessTokenFromUserService.execute(user)
      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
      expect(response.body).toBeDefined()
      expect(response.body.id).toEqual(user.id)
    })

    it("/GET returns 403 because user id is not same as current user", async () => {
      const user = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: "test"
        }
      })

      const user2 = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test2@test.com",
          password: "test"
        }
      })
      const accessToken = await buildAccessTokenFromUserService.execute(user)
      const response = await request(app.getHttpServer())
        .get(`/users/${user2.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(401)
      expect(response.body).toBeDefined()
    })
  })

  describe("/GET", () => {
    it("/GET successfully gets all users", async () => {
      const user = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: "test"
        }
      })

      const accessToken = await buildAccessTokenFromUserService.execute(user)
      const response = await request(app.getHttpServer())
        .get("/users")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
      expect(response.body).toBeDefined()
      expect(response.body).toHaveLength(1)
    })
  })

  describe("/PATCH", () => {
    it("/PATCH successfully updates a user", async () => {
      const user = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: "test"
        }
      })

      const accessToken = await buildAccessTokenFromUserService.execute(user)
      const response = await request(app.getHttpServer())
        .patch(`/users/${user.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "test2",
          lastName: "test2"
        })
        .expect(200)
      expect(response.body).toBeDefined()
      expect(response.body.firstName).toEqual("test2")
      expect(response.body.lastName).toEqual("test2")
    })

    it("/PATCH fails updating a user because user id is not the same as the current user", async () => {
      const user = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: "test"
        }
      })
      const user2 = await prismaService.user.create({
        data: {
          firstName: "test2",
          lastName: "test2",
          email: "test2@example.com",
          password: "test2"
        }
      })

      const accessToken = await buildAccessTokenFromUserService.execute(user)
      const response = await request(app.getHttpServer())
        .patch(`/users/${user2.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "test2",
          lastName: "test2"
        })
        .expect(401)
      expect(response.body).toBeDefined()
    })

    it("/PATCH fails updating a user because first name is empty", async () => {
      const user = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: "test"
        }
      })
      const accessToken = await buildAccessTokenFromUserService.execute(user)
      const response = await request(app.getHttpServer())
        .patch(`/users/${user.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "",
          lastName: "test2"
        })
        .expect(400)
      expect(response.body).toBeDefined()
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
