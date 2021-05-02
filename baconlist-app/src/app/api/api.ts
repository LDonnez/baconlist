import { createApiInstance } from "api"
import axios, { AxiosInstance, AxiosStatic } from "axios"
import { API_URLS } from "./config"

function createProtectedInstance(
  axiosInstance: AxiosStatic,
  url: string
): AxiosInstance {
  const instance = createApiInstance(axiosInstance, url)
  return instance
}

export const baconlistApi = createProtectedInstance(axios, API_URLS.baconlist)
