import { Route, Switch } from "react-router-dom"
import { routes } from "./routes"
import { RouteObject } from "./types"
import { Router } from "react-router-dom"
import { history } from "reducers"
import ProtectedRoute from "./ProtectedRoute"

export const AppRouter = (): JSX.Element => {
  return (
    <Router history={history}>
      <Switch>
        {routes.map(({ path, component, authorized, ...rest }: RouteObject) => {
          if (authorized) {
            return (
              <ProtectedRoute
                key={path}
                path={path}
                authorized={authorized}
                component={component}
                {...rest}
              />
            )
          }
          return (
            <Route key={path} path={path} component={component} {...rest} />
          )
        })}
      </Switch>
    </Router>
  )
}

export default AppRouter
