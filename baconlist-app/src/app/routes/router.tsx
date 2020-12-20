import React from "react"
import { Route, Switch } from "react-router-dom"
import { routes } from "./routes"
import { RouteObject } from "./types"
import { BrowserRouter } from "react-router-dom"

export const Router = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Switch>
        {routes.map(({ path, component, authorized, ...rest }: RouteObject) => {
          return <Route key={path} component={component} {...rest} />
        })}
      </Switch>
    </BrowserRouter>
  )
}

export default Router
