import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket
} from "@nestjs/websockets"
import { Socket } from "socket.io"
import { Inject } from "@nestjs/common"
import { RetrieveFriendRequestsService } from "../../services/friendRequests/retrieveFriendRequests.service"
import { JwtService } from "@nestjs/jwt"
import { Messages } from "./types"
import { BaseGateway } from "../../../../gateways/base.gateway"

@WebSocketGateway({ namespace: "friend_requests" })
export class FriendRequestsGateway extends BaseGateway {
  constructor(
    @Inject(RetrieveFriendRequestsService)
    private readonly retrieveFriendRequestsService: RetrieveFriendRequestsService,
    @Inject(JwtService)
    jwtService: JwtService
  ) {
    super(jwtService)
  }

  @SubscribeMessage(Messages.GET)
  public async get(@ConnectedSocket() client: Socket): Promise<void> {
    client.join(this.room)
    const data = await this.retrieveFriendRequestsService.execute(
      this.currentUserId
    )
    client.nsp.to(this.room).emit(Messages.GET, data)
  }

  public async refresh(userId: string): Promise<void> {
    const data = await this.retrieveFriendRequestsService.execute(
      this.currentUserId
    )
    this.server.to(`/friend_requests/${userId}`).emit(Messages.GET, data)
  }

  private get room(): string {
    return `/friend_requests/${this.currentUserId}`
  }
}
