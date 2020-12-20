import { createApiInstance } from "api"
import axios, { AxiosInstance, AxiosStatic } from "axios"
import { API_URLS } from "./config"
import {
  requestInterceptor,
  responseErrorInterceptor,
  responseInterceptor
} from "./interceptors"

function createProtectedInstance(
  axiosInstance: AxiosStatic,
  url: string
): AxiosInstance {
  const instance = createApiInstance(axiosInstance, url)
  instance.interceptors.request.use(requestInterceptor)
  instance.interceptors.response.use(
    responseInterceptor,
    responseErrorInterceptor
  )
  return instance
}

export const exampleApi = createProtectedInstance(axios, API_URLS.example)
