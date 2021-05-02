import { bootstrapTestingModule } from "./helper"
import { DatabaseService } from "../../../database/database.service"
import { BuildCsrfTokenService } from "../buildCsrfToken.service"

describe("BuildCsrfTokenService", () => {
  let buildCsrfTokenService: BuildCsrfTokenService
  let databaseService: DatabaseService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    buildCsrfTokenService = module.get<BuildCsrfTokenService>(
      BuildCsrfTokenService
    )
  })

  it("should be defined", () => {
    expect(buildCsrfTokenService).toBeDefined()
  })

  it("should successfully build a session token", () => {
    const result = buildCsrfTokenService.execute()
    expect(result).toBeDefined()
    const splittedResult = result.split(".")
    expect(splittedResult).toHaveLength(3)
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
