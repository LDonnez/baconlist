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
import { BuildCookieWithCsrfTokenService } from "../../services/buildCookieWithCsrfToken.service"
import { BuildCsrfTokenService } from "../../services/buildCsrfToken.service"

describe("RefreshTokenController", () => {
  let app: INestApplication
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let refreshTokenStateRepository: Repository<RefreshTokenState>
  let buildCookieWithRefreshTokenService: BuildCookieWithRefreshTokenService
  let buildCsrfCookieService: BuildCookieWithCsrfTokenService
  let buildCsrfTokenService: BuildCsrfTokenService
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
    buildCookieWithRefreshTokenService = module.get<
      BuildCookieWithRefreshTokenService
    >(BuildCookieWithRefreshTokenService)
    buildCsrfCookieService = module.get<BuildCookieWithCsrfTokenService>(
      BuildCookieWithCsrfTokenService
    )
    buildCsrfTokenService = module.get<BuildCsrfTokenService>(
      BuildCsrfTokenService
    )
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
      const cookie = buildCookieWithRefreshTokenService.execute(refreshToken)
      const csrfToken = buildCsrfTokenService.execute()
      const csrfCookie = buildCsrfCookieService.execute(csrfToken)
      const response = await request(app.getHttpServer())
        .post("/auth/refresh_token")
        .set({ "X-CSRF-TOKEN": csrfToken })
        .set("Cookie", [cookie, csrfCookie])
        .expect(200)
      expect(response.body).toBeDefined()
      expect(response.body.refreshToken).toBeDefined()
      expect(response.body.accessToken).toBeDefined()
      expect(response.header["set-cookie"]).toHaveLength(2)
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
      const csrfToken = buildCsrfTokenService.execute()
      const csrfCookie = buildCsrfCookieService.execute(csrfToken)
      const response = await request(app.getHttpServer())
        .post("/auth/refresh_token")
        .set({ "X-CSRF-TOKEN": csrfToken })
        .set("Cookie", csrfCookie)
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
      const csrfToken = buildCsrfTokenService.execute()
      const csrfCookie = buildCsrfCookieService.execute(csrfToken)
      const response = await request(app.getHttpServer())
        .post("/auth/refresh_token")
        .set({ "X-CSRF-TOKEN": csrfToken })
        .set("Cookie", csrfCookie)
        .send({
          refreshToken
        })
        .expect(401)
      expect(response.body).toBeDefined()
    })

    it("/POST /auth/refresh_token fails retrieving a new accesstoken because refresh token is not set", async () => {
      const csrfToken = buildCsrfTokenService.execute()
      const csrfCookie = buildCsrfCookieService.execute(csrfToken)
      const response = await request(app.getHttpServer())
        .post("/auth/refresh_token")
        .set({ "X-CSRF-TOKEN": csrfToken })
        .set("Cookie", csrfCookie)
        .expect(401)

      expect(response.body).toBeDefined()
    })
  })

  it("/POST /auth/refresh_token fails retrieving new access token because X-CSRF-TOKEN header is not set", async () => {
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
    const cookie = buildCookieWithRefreshTokenService.execute(refreshToken)
    const csrfToken = buildCsrfTokenService.execute()
    const csrfCookie = buildCsrfCookieService.execute(csrfToken)
    const response = await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .set("Cookie", [cookie, csrfCookie])
      .expect(403)
    expect(response.body).toBeDefined()
    expect(response.header["set-cookie"]).toBeUndefined()
  })

  it("/POST /auth/refresh_token fails retrieving new access token because _csrf cookie is not set", async () => {
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
    const cookie = buildCookieWithRefreshTokenService.execute(refreshToken)
    const csrfToken = buildCsrfTokenService.execute()
    const response = await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .set({ "X-CSRF-TOKEN": csrfToken })
      .set("Cookie", [cookie])
      .expect(403)
    expect(response.body).toBeDefined()
    expect(response.header["set-cookie"]).toBeUndefined()
  })

  it("/POST /auth/refresh_token fails retrieving new access token because csrfToken is not verified", async () => {
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
    const cookie = buildCookieWithRefreshTokenService.execute(refreshToken)
    const csrfToken = buildCsrfTokenService.execute()
    const csrfCookie = buildCsrfCookieService.execute(csrfToken)
    const response = await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .set({ "X-CSRF-TOKEN": "invalid" })
      .set("Cookie", [cookie, csrfCookie])
      .expect(401)
    expect(response.body).toBeDefined()
    expect(response.header["set-cookie"]).toBeUndefined()
  })

  it("/POST /auth/refresh_token fails retrieving new access token because csrfToken in header is not the same as in the cookie", async () => {
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
    const cookie = buildCookieWithRefreshTokenService.execute(refreshToken)
    const csrfToken = buildCsrfTokenService.execute()
    const csrfToken2 = buildCsrfTokenService.execute()
    const csrfCookie = buildCsrfCookieService.execute(csrfToken)
    const response = await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .set({ "X-CSRF-TOKEN": csrfToken2 })
      .set("Cookie", [cookie, csrfCookie])
      .expect(403)
    expect(response.body).toBeDefined()
    expect(response.header["set-cookie"]).toBeUndefined()
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await app.close()
    await databaseService.closeConnection()
  })
})
