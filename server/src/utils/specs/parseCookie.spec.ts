import { parseCookie, parseCookieToObject } from "../parseCookie"

describe("parseCookie", () => {
  describe("parseCookieToObject", () => {
    it("successfully parses the cookies to an object", () => {
      const result = parseCookieToObject("refreshToken=test")
      expect(result).toBeDefined()
      expect(result?.refreshToken).toBeDefined()
    })

    it("successfully parses the cookies to an object when the value has an '=' included", () => {
      const result = parseCookieToObject("refreshToken=test=test")
      expect(result).toBeDefined()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(Object.values(result!)).toHaveLength(1)
      expect(result?.refreshToken).toBeDefined()
    })

    it("fails parsing the cooke because no cookie is empty", () => {
      const result = parseCookieToObject("")
      expect(result).toBeUndefined()
    })

    it("returns empty object because cookie is in invalid", () => {
      const result = parseCookieToObject("invalid")
      expect(result).toEqual({})
    })
  })

  describe("parseCookie", () => {
    it("successfully returns the result of given cookie", () => {
      const result = parseCookie("refreshToken=test", "refreshToken")
      expect(result).toEqual("test")
    })

    it("fails returning a value of a cookie because it does not exist", () => {
      const result = parseCookie("", "refreshToken")
      expect(result).toBeUndefined()
    })
  })
})
