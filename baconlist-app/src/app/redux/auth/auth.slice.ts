import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
  SerializedError
} from "@reduxjs/toolkit"
import * as authApi from "app/api/auth"
import { AccessTokenPayload } from "app/types/accessTokenPayload"
import { parseCookie } from "app/utils/parseCookie"
import { isExpired, parseToken } from "app/utils/token"
import { RootState } from "store"
import * as api from "app/api/auth"

export type AuthState = {
  refreshToken?: string
  accessToken?: string
  csrfToken?: string
  isLoading: boolean
  error?: SerializedError
}

const initialState: AuthState = {
  refreshToken: undefined,
  accessToken: undefined,
  csrfToken: parseCookie(document.cookie, "_csrf"),
  isLoading: false,
  error: undefined
}

export const authenticate = createAsyncThunk(
  "auth/authenticate",
  async (payload: { email: string; password: string }, { dispatch, extra: { baconlistApi } }) => {
    const response = await api.login(baconlistApi, payload)
    const csrfTokenFromCookie = parseCookie(document.cookie, "_csrf")
    if (csrfTokenFromCookie) {
      dispatch(setCsrfToken(csrfTokenFromCookie))
    }
    return response.data
  }
)

export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, { dispatch, getState, extra: { baconlistApi } }) => {
    const state: RootState = getState() as RootState
    const csrfToken = getCsrfToken(state) as string
    const response = await api.refreshToken(baconlistApi, { csrfToken })
    const csrfTokenFromCookie = parseCookie(document.cookie, "_csrf")
    if (csrfTokenFromCookie) {
      dispatch(setCsrfToken(csrfTokenFromCookie))
    }
    return response.data
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCsrfToken(state: AuthState, action: PayloadAction<string>) {
      state.csrfToken = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(authenticate.pending, (state, _) => {
        state.isLoading = true
      })
      .addCase(authenticate.fulfilled, (state, action) => {
        const { refreshToken, accessToken } = action.payload
        state.refreshToken = refreshToken
        state.accessToken = accessToken
        state.isLoading = false
      })
      .addCase(authenticate.rejected, (state, action) => {
        const { error } = action
        state.error = error
      })
      .addCase(refresh.pending, (state, _) => {
        state.isLoading = true
      })
      .addCase(refresh.fulfilled, (state, action) => {
        const { refreshToken, accessToken } = action.payload
        state.refreshToken = refreshToken
        state.accessToken = accessToken
        state.isLoading = false
      })
      .addCase(refresh.rejected, (state, action) => {
        const { error } = action
        state.error = error
      })
  }
})

export const { setCsrfToken } = authSlice.actions

export default authSlice.reducer

const selectSelf = (state: RootState) => state.auth

export const getIsLoading = createSelector(selectSelf, state => state.isLoading)
export const getError = createSelector(selectSelf, state => state.error)

export const getCsrfToken = createSelector(selectSelf, state => state.csrfToken)

export const getTokenPayload = createSelector(selectSelf, state => {
  if (state.accessToken) {
    return parseToken(state.accessToken)
  }
})

export const getAccessTokenIsExpired = createSelector(
  getTokenPayload,
  (tokenPayload: AccessTokenPayload | undefined) => {
    if (tokenPayload) {
      return isExpired(tokenPayload.exp)
    }
    return true
  }
)
