import { baconlistApi } from "./api"
import { AxiosPromise } from "axios"

export const callAuthenticate = (data: {
  email: string
  password: string
}): AxiosPromise<{ accessToken: string; refreshToken: string }> => {
  return baconlistApi("/auth/token", {
    withCredentials: true,
    method: "POST",
    data
  })
}

export const callRefresh = (
  csrfToken: string
): AxiosPromise<{
  accessToken: string
  refreshToken: string
}> => {
  return baconlistApi("/auth/refresh_token", {
    withCredentials: true,
    method: "POST",
    headers: {
      "X-CSRF-TOKEN": csrfToken
    }
  })
}
