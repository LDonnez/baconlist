import {
  createAsyncThunk,
  createSelector,
  createSlice,
  SerializedError
} from "@reduxjs/toolkit"
import * as api from "app/api/users"
import { User } from "app/types/user"
import { AxiosInstance } from "axios"
import { RootState } from "store"

export type CurrentUserState = {
  currentUser?: User,
  isLoading: boolean
  error?: SerializedError
}

const initialState: CurrentUserState = {
  currentUser: undefined,
  isLoading: false,
  error: undefined
}

export const getUserById = createAsyncThunk<User, { userId: string }, { extra: { baconlistApi: AxiosInstance } } >(
  "currentUser/getUserById",
  async (payload: { userId: string} , { extra: { baconlistApi } }) => {
    const response = await api.getUserById(baconlistApi, payload)
    return response.data
  }
)

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: { },
  extraReducers: builder => {
    builder
      .addCase(getUserById.pending, (state, _) => {
        state.isLoading = true
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload
        state.isLoading = false
      })
      .addCase(getUserById.rejected, (state, action) => {
        const { error } = action
        state.error = error
      })
  }
})

export default currentUserSlice.reducer

const selectSelf = (state: RootState) => state.currentUser

export const getIsLoading = createSelector(selectSelf, state => state.isLoading)
export const getError = createSelector(selectSelf, state => state.error)

export const getCurrentUser = createSelector(selectSelf, state => state.currentUser)
