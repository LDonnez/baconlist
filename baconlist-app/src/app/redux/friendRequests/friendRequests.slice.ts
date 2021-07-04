import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
  SerializedError
} from "@reduxjs/toolkit"
import { RootState } from "store"
import { Socket } from "socket.io-client"
import { SocketEvents } from "app/types/socketEvents"
import { FriendRequest } from "app/types/friendRequest"

export type FriendRequestsState = {
  data: FriendRequest[]
  isLoading: boolean
  error?: SerializedError
}

const initialState: FriendRequestsState = {
  data: [],
  isLoading: false,
  error: undefined
}

export const emit = createAsyncThunk(
  "friendRequests/emit",
  async (payload: { socket: Socket, event: SocketEvents }): Promise<void> => {
    const { socket, event } = payload
    socket.emit(event)
  }
)

export const listen = createAsyncThunk(
  "friendRequests/listen",
  async (payload: { socket: Socket, event: SocketEvents }, { dispatch }): Promise<void> => {
    const { socket, event } = payload
    socket.on(event, function (msg: FriendRequest[]) {
      dispatch(onNewFriendRequestSuccess(msg))
    })
  }
)

const friendRequestsSlice = createSlice({
  name: "friendRequests",
  initialState,
  reducers: {
    onNewFriendRequestSuccess(state: FriendRequestsState, action: PayloadAction<FriendRequest[]>) {
      state.data = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(emit.pending, (state, _) => {
        state.isLoading = true
      })
      .addCase(emit.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(emit.rejected, (state, action) => {
        const { error } = action
        state.error = error
      })
      .addCase(listen.pending, (state, _) => {
        state.isLoading = true
      })
      .addCase(listen.fulfilled, (state ) => {
        state.isLoading = false
      })
      .addCase(listen.rejected, (state, action) => {
        const { error } = action
        state.error = error
      })
  }
})

export const { onNewFriendRequestSuccess } = friendRequestsSlice.actions

export default friendRequestsSlice.reducer

const selectSelf = (state: RootState) => state.friendRequests

export const getIsLoading = createSelector(selectSelf, state => state.isLoading)
export const getError = createSelector(selectSelf, state => state.error)
