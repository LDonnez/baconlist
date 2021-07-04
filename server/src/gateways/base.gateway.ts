import {
  WebSocketServer,
  ConnectedSocket,
  WsException
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { JwtService } from "@nestjs/jwt"
import { TokenPayload } from "../types/tokenPayload"

export class BaseGateway {
  @WebSocketServer()
  protected readonly server: Server

  protected currentUserId: string

  constructor(private readonly jwtService: JwtService) {}

  protected async handleConnection(
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const auth: { accessToken?: string } = client.handshake.auth as {
      accessToken?: string
    }
    try {
      const accessToken = auth.accessToken
      if (accessToken) {
        const payload: TokenPayload = await this.jwtService.verifyAsync(
          accessToken
        )
        this.currentUserId = payload.sub
      }
    } catch (error) {
      throw new WsException("something went wrong")
    }
  }
}
