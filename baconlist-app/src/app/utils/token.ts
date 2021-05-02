import { AccessTokenPayload } from "app/types/accessTokenPayload"

export function parseToken(t: string): AccessTokenPayload | undefined {
  if (typeof t !== "string") {
    return
  }
  const base64Url = t.split(".")[1]
  if (!base64Url) return
  const base64 = base64Url.replace("-", "+").replace("_", "/")
  return JSON.parse(window.atob(base64))
}

export function isExpired(unixTimestamp: number): boolean {
  const exp = Math.floor(unixTimestamp)
  const today = Math.floor(Date.now() / 1000)
  return exp <= today
}
