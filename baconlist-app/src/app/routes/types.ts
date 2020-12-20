import { RouteComponentProps } from "react-router-dom"

export type RouteObject = {
  path: string
  exact: boolean
  authorized: boolean
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>
}
