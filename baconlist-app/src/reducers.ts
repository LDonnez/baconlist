import { createBrowserHistory, createMemoryHistory } from "history"
import { combineReducers } from "@reduxjs/toolkit"
import { appReducers } from "./app/redux/reducers"

const isTest = process.env.NODE_ENV === "test"

export const history = isTest
  ? createMemoryHistory({ initialEntries: ["/"] })
  : createBrowserHistory()

export const rootReducer = combineReducers(appReducers)
