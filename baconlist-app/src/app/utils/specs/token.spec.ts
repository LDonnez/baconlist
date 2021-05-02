import { isExpired, parseToken } from "../token"

describe("Token Util", () => {
  describe("parseToken", () => {
    it("successfully parses a token", async () => {
      const result = parseToken(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMWJkZjVhZC04ZGRjLTQ2ODMtYTM4Mi1jNDRmNmViZjRhY2IiLCJpYXQiOjE2MTc2MzI1MjgsImV4cCI6MTYxNzYzNjMyOH0.hfEwZ-K5vqNJ7sE6KQ0yMvZMjzCTw2GUTLe4byyx7GI"
      )
      expect(result?.exp).toBeDefined()
      expect(result?.sub).toBeDefined()
      expect(result?.iat).toBeDefined()
    })

    it("returns undefined because token is not valid", async () => {
      const result = parseToken("invalid")
      expect(result).toBeUndefined()
    })
  })

  describe("isExpired", () => {
    it("successfully detects expired timestamp", async () => {
      const unixTimestamp = new Date(2000, 1, 1).getTime() / 1000
      const result = isExpired(unixTimestamp)
      expect(result).toBeTruthy()
    })

    it("successfully detects non expired timestamp", async () => {
      const currentDate = new Date()
      const unixTimestamp = new Date().setMinutes(currentDate.getMinutes() + 1)
      const result = isExpired(unixTimestamp)
      expect(result).toBeFalsy()
    })
  })
})
