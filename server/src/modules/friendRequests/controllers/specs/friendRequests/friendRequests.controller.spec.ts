import * as request from "supertest"
import { INestApplication } from "@nestjs/common"
import { bootstrapTestApp, bootstrapTestingModule } from "../helper"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { DatabaseService } from "../../../../database/database.service"
import { User } from "../../../../users/entities/user.entity"
import { FriendRequest } from "../../../entities/friendRequest.entity"
import { BuildCookieService } from "../../../../authentication/services/buildCookie.service"

describe("FriendRequests Controller", () => {
  let app: INestApplication
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let friendRequestRepository: Repository<FriendRequest>
  let buildCookieService: BuildCookieService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()

    app = bootstrapTestApp(module)
    await app.init()

    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    friendRequestRepository = module.get<Repository<FriendRequest>>(
      getRepositoryToken(FriendRequest)
    )
    buildCookieService = module.get<BuildCookieService>(BuildCookieService)
  })

  it("app should be defined", () => {
    expect(app).toBeDefined()
  })

  describe("/POST", () => {
    it("/POST successfully saves a new friend request", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      })
      const receiver = await userRepository.save({
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      })
      const cookie = buildCookieService.execute(user)
      const response = await request(app.getHttpServer())
        .post("/friend_requests")
        .send({
          receiverId: receiver.id
        })
        .set("Cookie", cookie)
        .expect(201)
      expect(response.body).toBeDefined()
    })

    it("/POST fails saving a new friend request because receiver_id is empty", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      })
      await userRepository.save({
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      })
      const cookie = buildCookieService.execute(user)
      const response = await request(app.getHttpServer())
        .post("/friend_requests")
        .send({
          receiverId: ""
        })
        .set("Cookie", cookie)
        .expect(400)
      expect(response.body).toBeDefined()
    })
  })

  describe("/DELETE", () => {
    it("/DELETE successfully deletes a friend request", async () => {
      const requester = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      })
      const receiver = await userRepository.save({
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      })
      const friendRequest = await friendRequestRepository.save({
        receiverId: receiver.id,
        requesterId: requester.id
      })
      const cookie = buildCookieService.execute(receiver)
      const response = await request(app.getHttpServer())
        .delete(`/friend_requests/${friendRequest.id}`)
        .set("Cookie", cookie)
        .expect(200)
      expect(response.body).toBeDefined()
    })
  })

  describe("/GET", () => {
    it("/GET successfully gets all the friend requests from the receiver", async () => {
      const receiver = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: "test"
      })
      const requester = await userRepository.save({
        firstName: "test2",
        lastName: "test2",
        email: "test2@test.com",
        password: "test"
      })
      await friendRequestRepository.save({
        receiverId: receiver.id,
        requesterId: requester.id
      })
      const cookie = buildCookieService.execute(receiver)
      const response = await request(app.getHttpServer())
        .get("/friend_requests")
        .set("Cookie", cookie)
        .expect(200)
      expect(response.body).toBeDefined()
      expect(response.body).toHaveLength(1)
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
