import { rootReducer } from "reducers"
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { createProtectedInstance } from "app/api/api"
import axios, { AxiosInstance } from "axios"
import { API_URLS } from "app/api/config"

const baconlistApi = createProtectedInstance(axios, API_URLS.baconlist)

export const store = configureStore({
  reducer: rootReducer,
   middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware({
       thunk: { extraArgument: { baconlistApi }} }
     ),
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, { baconlistApi: AxiosInstance }, Action<string>>
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
