import { User } from "app/types/user"
import { AxiosInstance, AxiosPromise } from "axios"

export function getUserById(instance: AxiosInstance, data: { userId: string }): AxiosPromise<User> {
  return instance(`/users/${data.userId}`, {
    method: "GET",
  })
}
