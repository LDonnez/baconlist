import * as request from "supertest"
import { INestApplication } from "@nestjs/common"
import { bootstrapTestApp, bootstrapTestingModule } from "../helper"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { DatabaseService } from "../../../../database/database.service"
import { User } from "../../../../users/entities/user.entity"
import { FriendRequest } from "../../../../friendRequests/entities/friendRequest.entity"
import { BuildAccessTokenService } from "../../../../auth/services/buildAccessToken.service"
import { Friend } from "../../../entities/friend.entity"

describe("Friends Controller", () => {
  let app: INestApplication
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let friendRequestRepository: Repository<FriendRequest>
  let friendRepository: Repository<Friend>
  let buildAccessTokenService: BuildAccessTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()

    app = bootstrapTestApp(module)
    await app.init()

    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    friendRequestRepository = module.get<Repository<FriendRequest>>(
      getRepositoryToken(FriendRequest)
    )
    friendRepository = module.get<Repository<Friend>>(
      getRepositoryToken(Friend)
    )
    buildAccessTokenService = module.get<BuildAccessTokenService>(
      BuildAccessTokenService
    )
  })

  it("app should be defined", () => {
    expect(app).toBeDefined()
  })

  describe("/POST", () => {
    it("/POST /friends successfully saves a new friend", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      })
      const friend = await userRepository.save({
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      })
      await friendRequestRepository.save({
        requesterId: user.id,
        receiverId: friend.id
      })
      const accessToken = await buildAccessTokenService.execute(user)
      const response = await request(app.getHttpServer())
        .post("/friends")
        .send({
          friendId: friend.id
        })
        .set("Authorization", `Bearer ${accessToken} `)
        .expect(201)
      expect(response.body).toBeDefined()
    })

    it("/POST /friends fails creating a new friend because friendId is not present", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      })
      const friend = await userRepository.save({
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      })
      await friendRequestRepository.save({
        requesterId: user.id,
        receiverId: friend.id
      })
      await friendRepository.save({ userId: user.id, friendId: friend.id })
      const accessToken = await buildAccessTokenService.execute(user)
      const response = await request(app.getHttpServer())
        .post("/friends")
        .send()
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(400)
      expect(response.body).toBeDefined()
    })

    it("/POST /friends fails creating a new friend because it already exists", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      })
      const friend = await userRepository.save({
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      })
      await friendRequestRepository.save({
        requesterId: user.id,
        receiverId: friend.id
      })
      await friendRepository.save({ userId: user.id, friendId: friend.id })
      const accessToken = await buildAccessTokenService.execute(user)
      const response = await request(app.getHttpServer())
        .post("/friends")
        .send({
          friendId: friend.id
        })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(400)
      expect(response.body).toBeDefined()
    })
  })

  describe("/GET", () => {
    it("/GET /friends successfully retrieves a friend", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      })
      const friend = await userRepository.save({
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      })
      await friendRepository.save({ userId: user.id, friendId: friend.id })
      const accessToken = await buildAccessTokenService.execute(user)
      const response = await request(app.getHttpServer())
        .get("/friends")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
      expect(response.body).toBeDefined()
      expect(response.body).toHaveLength(1)
    })

    it("/GET /friends successfully no friends", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      })
      const accessToken = await buildAccessTokenService.execute(user)
      const response = await request(app.getHttpServer())
        .get("/friends")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
      expect(response.body).toBeDefined()
      expect(response.body).toHaveLength(0)
    })
  })

  describe("/DELETE ", () => {
    it("/DELETE /friends/:id successfully deletes a friend", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      })
      const user2 = await userRepository.save({
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      })
      const friend = await friendRepository.save({
        userId: user.id,
        friendId: user2.id
      })
      const accessToken = await buildAccessTokenService.execute(user)
      const response = await request(app.getHttpServer())
        .delete(`/friends/${friend.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
      expect(response.body).toBeDefined()
    })

    it("/DELETE /friends/:id fails deleting a friend because it does not exist", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      })
      const accessToken = await buildAccessTokenService.execute(user)
      const response = await request(app.getHttpServer())
        .delete("/friends/dd83ef31-c2e7-4a61-8472-820191415d2b")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404)
      expect(response.body).toBeDefined()
    })
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await app.close()
    await databaseService.closeConnection()
  })
})
