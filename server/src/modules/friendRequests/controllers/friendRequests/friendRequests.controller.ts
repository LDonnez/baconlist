import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Inject,
  Param,
  Get,
  UseGuards,
  Req,
  Delete
} from "@nestjs/common"
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse
} from "@nestjs/swagger"
import { CreateFriendRequestService } from "../../services/friendRequests/createFriendRequest.service"
import { DeleteFriendRequestService } from "../../services/friendRequests/deleteFriendRequest.service"
import { RetrieveFriendRequestsService } from "../../services/friendRequests/retrieveFriendRequests.service"
import { CreateFriendRequestDto } from "../../dto/createFriendRequest.dto"
import { JwtGuard } from "../../../authentication/guards/jwtGuard"
import { FriendRequest } from "../../entities/friendRequest.entity"
import { RequestWithUser } from "../../../authentication/types/requestWithUser"
import { FriendRequestsGateway } from "../../gateways/friendRequests/friendRequests.gateway"

@ApiTags("Friend Requests")
@Controller("friend_requests")
@UseGuards(JwtGuard)
export class FriendRequestsController {
  constructor(
    @Inject(CreateFriendRequestService)
    private readonly createFriendRequestService: CreateFriendRequestService,
    @Inject(DeleteFriendRequestService)
    private readonly deleteFriendRequestService: DeleteFriendRequestService,
    @Inject(RetrieveFriendRequestsService)
    private readonly retrieveFriendRequestsService: RetrieveFriendRequestsService,
    @Inject(FriendRequestsGateway)
    private readonly friendRequestsGateway: FriendRequestsGateway
  ) {}

  @ApiOperation({ description: "creates a new friend request" })
  @ApiOkResponse({
    description: "friend request successfully created",
    type: FriendRequest
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @Post()
  public async create(
    @Req() request: RequestWithUser,
    @Body() friendRequestData: CreateFriendRequestDto
  ): Promise<FriendRequest> {
    const userId = request.user.id
    const result = await this.createFriendRequestService.execute(
      userId,
      friendRequestData
    )
    await this.friendRequestsGateway.refresh(userId)
    await this.friendRequestsGateway.refresh(friendRequestData.receiverId)
    return result
  }

  @ApiOperation({
    description: "returns all friend requests from current user"
  })
  @ApiOkResponse({ description: "success", type: FriendRequest, isArray: true })
  @Get()
  public async index(
    @Req() request: RequestWithUser
  ): Promise<FriendRequest[]> {
    const userId = request.user.id
    return await this.retrieveFriendRequestsService.execute(userId)
  }

  @ApiOperation({ description: "deletes a friend request" })
  @ApiOkResponse({
    description: "friend request successfully deleted",
    type: FriendRequest
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @Delete("/:id")
  public async delete(
    @Req() request: RequestWithUser,
    @Param("id") id: string
  ): Promise<FriendRequest> {
    const userId = request.user.id
    const result = await this.deleteFriendRequestService.execute(userId, id)
    await this.friendRequestsGateway.refresh(userId)
    await this.friendRequestsGateway.refresh(result.receiverId)
    return result
  }
}
