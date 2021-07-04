import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket
} from "@nestjs/websockets"
import { Socket } from "socket.io"
import { Inject } from "@nestjs/common"
import { RetrieveFriendsService } from "../../services/friends/retrieveFriends.service"
import { JwtService } from "@nestjs/jwt"
import { SocketEvents } from "./types"
import { BaseGateway } from "../../../../gateways/base.gateway"

@WebSocketGateway({ namespace: "friends" })
export class FriendsGateway extends BaseGateway {
  constructor(
    @Inject(RetrieveFriendsService)
    private readonly retrieveFriendsService: RetrieveFriendsService,
    @Inject(JwtService)
    jwtService: JwtService
  ) {
    super(jwtService)
  }

  @SubscribeMessage(SocketEvents.NEW_FRIEND)
  public async get(@ConnectedSocket() client: Socket): Promise<void> {
    await client.join(this.room)
    const data = await this.retrieveFriendsService.execute(this.currentUserId)
    client.nsp.to(this.room).emit(SocketEvents.NEW_FRIEND, data)
  }

  public async refresh(userId: string): Promise<void> {
    const data = await this.retrieveFriendsService.execute(this.currentUserId)
    this.server.to(`/friends/${userId}`).emit(SocketEvents.NEW_FRIEND, data)
  }

  private get room(): string {
    return `/friends/${this.currentUserId}`
  }
}
