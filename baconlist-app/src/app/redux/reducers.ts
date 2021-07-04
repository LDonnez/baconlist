import authReducer from "./auth/auth.slice"
import friendRequestsReducer from "./friendRequests/friendRequests.slice"

export const appReducers = {
  auth: authReducer
  friendRequests: friendRequestsReducer,
}
