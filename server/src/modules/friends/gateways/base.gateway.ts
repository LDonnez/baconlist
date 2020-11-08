import {
  WebSocketServer,
  ConnectedSocket,
  WsException
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { parseCookie } from "../../../utils/parseCookie"
import { JwtService } from "@nestjs/jwt"
import { TokenPayload } from "../../types/tokenPayload"

export class BaseGateway {
  @WebSocketServer()
  protected readonly server: Server

  protected currentUserId: string

  constructor(private readonly jwtService: JwtService) {}

  protected async handleConnection(
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const headers: { cookie?: string } = client.handshake.headers as {
      cookie?: string
    }
    const cookie = headers.cookie
    if (cookie) {
      const token = parseCookie(cookie, "accessToken")
      if (token) {
        try {
          const payload: TokenPayload = await this.jwtService.verifyAsync(token)
          this.currentUserId = payload.sub
        } catch (error) {
          throw new WsException("not allowed")
        }
      }
    }
  }
}
