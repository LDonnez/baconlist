import { RouteObject } from "./types"
import { ExampleRoute } from "./ExampleRoute"

export const routes: RouteObject[] = [
  {
    component: ExampleRoute,
    exact: true,
    authorized: true,
    path: "/"
  }
]
