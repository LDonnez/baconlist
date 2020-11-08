import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket
} from "@nestjs/websockets"
import { Socket } from "socket.io"
import { Inject } from "@nestjs/common"
import { RetrieveFriendsService } from "../../services/friends/retrieveFriends.service"
import { JwtService } from "@nestjs/jwt"
import { BaseGateway } from "../base.gateway"
import { Messages } from "./types"

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

  @SubscribeMessage(Messages.GET)
  public async get(@ConnectedSocket() client: Socket): Promise<void> {
    client.join(this.room)
    const data = await this.retrieveFriendsService.execute(this.currentUserId)
    client.nsp.to(this.room).emit(Messages.GET, data)
  }

  public async refresh(userId: string): Promise<void> {
    const data = await this.retrieveFriendsService.execute(this.currentUserId)
    this.server.to(`/friends/${userId}`).emit(Messages.GET, data)
  }

  private get room(): string {
    return `/friends/${this.currentUserId}`
  }
}
