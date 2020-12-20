import { AxiosStatic } from "axios"

export const createApiInstance = (axios: AxiosStatic, url: string) =>
  axios.create({ baseURL: url })
