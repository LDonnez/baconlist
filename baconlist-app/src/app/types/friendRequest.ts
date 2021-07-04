import { User } from "./user";

export type FriendRequest =  {
  id: string
  receiverId: string
  receiver: User
  requester: User
  createdAt: string
  updatedAt: string
}
