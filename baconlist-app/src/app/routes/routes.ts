import { RouteObject } from "./types"
import { LoginRoute } from "./LoginRoute"
import { RootRoute } from "./RootRoute"

export const routes: RouteObject[] = [
  {
    component: RootRoute,
    exact: true,
    authorized: true,
    path: "/"
  },
  {
    component: LoginRoute,
    exact: true,
    authorized: false,
    path: "/login"
  }
]
