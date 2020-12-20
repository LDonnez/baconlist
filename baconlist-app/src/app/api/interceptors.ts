import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"

export function requestInterceptor(config: AxiosRequestConfig) {
  config.headers.Authorization = `Bearer <access_token>`
  return config
}

export function responseInterceptor(response: AxiosResponse) {
  return response
}

export function responseErrorInterceptor(error: AxiosError) {
  if (error && error.response && error.response.status === 401) {
    console.log("refresh token here")
  }
  return Promise.reject(error)
}
