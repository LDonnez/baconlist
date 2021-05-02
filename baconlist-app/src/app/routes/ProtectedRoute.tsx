import { Route } from "react-router-dom"
import { useAuth } from "app/hooks/useAuth"
import { RouteObject } from "./types"

export const ProtectedRoute = ({
  path,
  component,
  ...rest
}: RouteObject): JSX.Element => {
  const { authorized } = useAuth()
  console.log("AUTHORIZED: ", authorized)
  return <Route path={path} component={component} {...rest} />
}

export default ProtectedRoute
