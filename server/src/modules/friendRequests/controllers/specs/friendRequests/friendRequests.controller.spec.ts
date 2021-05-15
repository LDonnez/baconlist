import * as request from "supertest"
import { INestApplication } from "@nestjs/common"
import { bootstrapTestApp, bootstrapTestingModule } from "../helper"
import { BuildAccessTokenService } from "../../../../auth/services/buildAccessToken.service"
import { PrismaService } from "../../../../prisma/prisma.service"

describe("FriendRequests Controller", () => {
  let app: INestApplication
  let prismaService: PrismaService
  let buildAccessTokenFromUserService: BuildAccessTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()

    app = bootstrapTestApp(module)
    await app.init()

    prismaService = module.get<PrismaService>(PrismaService)
    buildAccessTokenFromUserService = module.get<BuildAccessTokenService>(
      BuildAccessTokenService
    )
  })

  it("app should be defined", () => {
    expect(app).toBeDefined()
  })

  describe("/POST", () => {
    it("/POST successfully saves a new friend request", async () => {
      const user = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: "test"
        }
      })
      const receiver = await prismaService.user.create({
        data: {
          firstName: "test2",
          lastName: "test2",
          email: "test2@test.com",
          password: "test"
        }
      })
      const accessToken = await buildAccessTokenFromUserService.execute(user)
      const response = await request(app.getHttpServer())
        .post("/friend_requests")
        .send({
          receiverId: receiver.id
        })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(201)
      expect(response.body).toBeDefined()
    })

    it("/POST fails saving a new friend request because receiver_id is empty", async () => {
      const user = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: "test"
        }
      })
      await prismaService.user.create({
        data: {
          firstName: "test2",
          lastName: "test2",
          email: "test2@test.com",
          password: "test"
        }
      })
      const accessToken = await buildAccessTokenFromUserService.execute(user)
      const response = await request(app.getHttpServer())
        .post("/friend_requests")
        .send({
          receiverId: ""
        })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(400)
      expect(response.body).toBeDefined()
    })
  })

  describe("/DELETE", () => {
    it("/DELETE successfully deletes a friend request", async () => {
      const requester = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: "test"
        }
      })
      const receiver = await prismaService.user.create({
        data: {
          firstName: "test2",
          lastName: "test2",
          email: "test2@test.com",
          password: "test"
        }
      })
      const friendRequest = await prismaService.friendRequest.create({
        data: {
          receiverId: receiver.id,
          requesterId: requester.id
        }
      })
      const accessToken = await buildAccessTokenFromUserService.execute(
        receiver
      )
      const response = await request(app.getHttpServer())
        .delete(`/friend_requests/${friendRequest.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
      expect(response.body).toBeDefined()
    })
  })

  describe("/GET", () => {
    it("/GET successfully gets all the friend requests from the receiver", async () => {
      const receiver = await prismaService.user.create({
        data: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: "test"
        }
      })
      const requester = await prismaService.user.create({
        data: {
          firstName: "test2",
          lastName: "test2",
          email: "test2@test.com",
          password: "test"
        }
      })
      await prismaService.friendRequest.create({
        data: {
          receiverId: receiver.id,
          requesterId: requester.id
        }
      })
      const accessToken = await buildAccessTokenFromUserService.execute(
        receiver
      )
      const response = await request(app.getHttpServer())
        .get("/friend_requests")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
      expect(response.body).toBeDefined()
      expect(response.body).toHaveLength(1)
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
