import { createApiInstance } from "api"
import { AxiosInstance, AxiosStatic } from "axios"
import { io, Socket } from "socket.io-client"
import { requestInterceptor } from "./interceptors"

export function createProtectedInstance(
  axiosInstance: AxiosStatic,
  url: string
): AxiosInstance {
  const instance = createApiInstance(axiosInstance, url)
  instance.interceptors.request.use(requestInterceptor)
  return instance
}

export const baconlistApi = createProtectedInstance(axios, API_URLS.baconlist)
