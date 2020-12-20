import { exampleApi } from "./api"

export const getExample = () => {
  return exampleApi("/example", {
    method: "GET"
  })
}
