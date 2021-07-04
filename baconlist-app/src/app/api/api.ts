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

export async function connectToAuthorizedWebSocket(
  uri: string,
  accessToken: string
): Promise<Socket> {
  const socket = io(uri, { auth: { accessToken } })
  return new Promise(resolve => {
    socket.on("connect", () => {
      resolve(socket)
    })
  })
}
