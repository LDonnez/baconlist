import { bootstrapTestingModule } from "./helper"
import { DatabaseService } from "../../../database/database.service"
import { BuildCookieWithCsrfTokenService } from "../buildCookieWithCsrfToken.service"

describe("BuildCookieWithCsrfTokenService", () => {
  let databaseService: DatabaseService
  let buildCookieWithCsrfTokenService: BuildCookieWithCsrfTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    buildCookieWithCsrfTokenService = module.get<
      BuildCookieWithCsrfTokenService
    >(BuildCookieWithCsrfTokenService)
  })

  it("should be defined", () => {
    expect(buildCookieWithCsrfTokenService).toBeDefined()
  })

  it("should successfully build a csrf cookie", () => {
    const result = buildCookieWithCsrfTokenService.execute("token")
    expect(result).toBeDefined()
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
