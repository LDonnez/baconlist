import { combineReducers, Reducer } from "redux"
import { appReducers } from "./app/redux/reducers"
import { State } from "./app/redux/state"

export const rootReducer = (): Reducer<State> =>
  combineReducers({
    ...appReducers
  })
