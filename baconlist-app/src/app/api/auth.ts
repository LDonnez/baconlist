import { AuthResponse } from "app/types/authResponse"
import { AxiosInstance, AxiosPromise } from "axios"

export function login(
  instance: AxiosInstance,
  data: { email: string; password: string }
): AxiosPromise<AuthResponse> {
  return instance("/auth/token", {
    withCredentials: true,
    method: "POST",
    data
  })
}

export function refreshToken(
  instance: AxiosInstance,
  data: { csrfToken: string }
): AxiosPromise<AuthResponse> {
  return instance("/auth/refresh_token", {
    withCredentials: true,
    method: "POST",
    headers: {
      "X-CSRF-TOKEN": data.csrfToken
    }
  })
}
