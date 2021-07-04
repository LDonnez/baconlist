import { AuthResponse } from "app/types/authResponse";
import { AxiosInstance, AxiosPromise } from "axios";

export function login(instance: AxiosInstance, data: { email: string, password: string }): AxiosPromise<AuthResponse> {
  return instance("/auth/token", {
    withCredentials: true,
    method: "POST",
    data 
  })
}
