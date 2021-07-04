import React, { useCallback, useEffect, useState } from "react"
import { connectToAuthorizedWebSocket } from "app/api/api"
import { API_URLS } from "app/api/config"
import { useAuth } from "app/hooks/useAuth"
import { SocketContext } from "app/contexts/socket"
import { Socket } from "socket.io-client"

type Props = {
  children: React.ReactNode
}

export const SocketProvider = ({ children }: Props) => {
  const { authorized, accessToken } = useAuth()
  const [friendRequestsSocket, setFriendRequestsSocket] = useState<
    Socket | undefined
  >()

  const connectFriendRequestsSocket = useCallback(async () => {
    if (authorized && accessToken) {
      const socket = await connectToAuthorizedWebSocket(
        `${API_URLS.baconlist}/friend_requests`,
        accessToken
      )
      setFriendRequestsSocket(socket)
    }
  }, [authorized, accessToken])

  useEffect(() => {
    if (authorized && accessToken) {
      connectFriendRequestsSocket()
    }
  }, [authorized, accessToken, connectFriendRequestsSocket])

  return (
    <SocketContext.Provider value={{ friendRequestsSocket }}>
      {children}
    </SocketContext.Provider>
  )
}
