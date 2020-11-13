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
import { BuildCookieWithRefreshTokenService } from "../../services/buildCookieWithRefreshToken.service"
import { BuildRefreshTokenService } from "../../services/buildRefreshToken.service"

describe("RefreshTokenController", () => {
  let app: INestApplication
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let refreshTokenStateRepository: Repository<RefreshTokenState>
  let buildCookieWithRefreshToken: BuildCookieWithRefreshTokenService
  let buildRefreshTokenService: BuildRefreshTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()

    app = bootstrapTestApp(module)
    await app.init()

    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    refreshTokenStateRepository = module.get<Repository<RefreshTokenState>>(
      getRepositoryToken(RefreshTokenState)
    )
    buildRefreshTokenService = module.get<BuildRefreshTokenService>(
      BuildRefreshTokenService
    )
    buildCookieWithRefreshToken = module.get<
      BuildCookieWithRefreshTokenService
    >(BuildCookieWithRefreshTokenService)
  })

  it("app should be defined", () => {
    expect(app).toBeDefined()
  })

  describe("/POST", () => {
    it("/POST /auth/refresh_token successfully retrieves a new accesstoken when refresh token is set in cookie", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: await hash("test", 10)
      })
      const refreshTokenState = await refreshTokenStateRepository.save({
        userId: user.id,
        userAgent: "test",
        revoked: false
      })
      const refreshToken = await buildRefreshTokenService.execute(
        refreshTokenState
      )
      const cookie = buildCookieWithRefreshToken.execute(refreshToken)
      const response = await request(app.getHttpServer())
        .post("/auth/refresh_token")
        .set("Cookie", cookie)
        .expect(200)
      expect(response.body).toBeDefined()
      expect(response.body.refreshToken).toBeDefined()
      expect(response.body.accessToken).toBeDefined()
    })

    it("/POST /auth/refresh_token successfully retrieves a new accesstoken when refresh token is set in body", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: await hash("test", 10)
      })
      const refreshTokenState = await refreshTokenStateRepository.save({
        userId: user.id,
        userAgent: "test",
        revoked: false
      })
      const refreshToken = await buildRefreshTokenService.execute(
        refreshTokenState
      )
      const response = await request(app.getHttpServer())
        .post("/auth/refresh_token")
        .send({
          refreshToken
        })
        .expect(200)
      expect(response.body).toBeDefined()
      expect(response.body.refreshToken).toBeDefined()
      expect(response.body.accessToken).toBeDefined()
    })

    it("/POST /auth/refresh_token successfully fails retrieving a new access token because refresh token is revoked", async () => {
      const user = await userRepository.save({
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password: await hash("test", 10)
      })
      const refreshTokenState = await refreshTokenStateRepository.save({
        userId: user.id,
        userAgent: "test",
        revoked: true
      })
      const refreshToken = await buildRefreshTokenService.execute(
        refreshTokenState
      )
      const response = await request(app.getHttpServer())
        .post("/auth/refresh_token")
        .send({
          refreshToken
        })
        .expect(401)
      expect(response.body).toBeDefined()
    })

    it("/POST /auth/refresh_token fails retrieving a new accesstoken because refresh token is not set", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh_token")
        .expect(401)

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
