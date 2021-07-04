import React from "react"
import { Socket } from "socket.io-client"

export type SocketContextType = {
  friendRequestsSocket?: Socket
}

export const SocketContext = React.createContext<SocketContextType>({})
