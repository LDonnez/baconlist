import { AxiosRequestConfig } from "axios"
import store from "store"

export async function requestInterceptor(
  config: AxiosRequestConfig
): Promise<AxiosRequestConfig> {
  try {
    const state = store.getState()
    const authToken = state.auth.accessToken
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
  } catch (error) {
  } finally {
    return config
  }
}
