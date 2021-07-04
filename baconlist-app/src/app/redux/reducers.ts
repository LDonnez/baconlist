import authReducer from "./auth/auth.slice"
import friendRequestsReducer from "./friendRequests/friendRequests.slice"
import currentUserReducer from "./currentUser/currentUser.slice"

export const appReducers = {
  auth: authReducer,
  friendRequests: friendRequestsReducer,
  currentUser: currentUserReducer
}
