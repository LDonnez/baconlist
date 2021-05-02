/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as request from "supertest"
import { INestApplication } from "@nestjs/common"
import { bootstrapTestApp, bootstrapTestingModule } from "./helper"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { DatabaseService } from "../../../database/database.service"
import { User } from "../../../users/entities/user.entity"
import { hash } from "bcrypt"
import { RefreshTokenState } from "../../entities/refreshTokenState.entity"

describe("Auth Controller", () => {
  let app: INestApplication
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let refreshTokenStateRepository: Repository<RefreshTokenState>

  beforeAll(async () => {
    const module = await bootstrapTestingModule()

    app = bootstrapTestApp(module)
    await app.init()

    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    refreshTokenStateRepository = module.get<Repository<RefreshTokenState>>(
      getRepositoryToken(RefreshTokenState)
    )
  })

  it("app should be defined", () => {
    expect(app).toBeDefined()
  })

  describe("/POST", () => {
    it("/POST /auth/token successfully authenticates a user ", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: await hash("test", 10)
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
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: await hash("test", 10)
      })
      const response = await request(app.getHttpServer())
        .post("/auth/token")
        .set("user-agent", "test")
        .send({
          email: user.email,
          password: "wrongpassword"
        })
        .expect(400)
      expect(response.body).toBeDefined()
      expect(response.header["set-cookie"]).toBeUndefined()
    })

    it("/POST /auth/token fails authenticating a user because user is not found with email", async () => {
      await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: await hash("test", 10)
      })
      const response = await request(app.getHttpServer())
        .post("/auth/token")
        .set("user-agent", "test")
        .send({
          email: "email@notexists.com",
          password: "test"
        })
        .expect(400)
      expect(response.body).toBeDefined()
      expect(response.header["set-cookie"]).toBeUndefined()
    })

    it("/POST /auth/token fails authenticating a user because refresh token is revoked", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: await hash("test", 10)
      })

      await refreshTokenStateRepository.save({
        userId: user.id,
        userAgent: "test",
        revoked: true
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
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await app.close()
    await databaseService.closeConnection()
  })
})
