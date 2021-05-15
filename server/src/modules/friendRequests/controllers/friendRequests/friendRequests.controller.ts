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
import { JwtGuard } from "../../../auth/guards/jwtGuard"
import { RequestWithUser } from "../../../auth/types/requestWithUser"
import { FriendRequestsGateway } from "../../gateways/friendRequests/friendRequests.gateway"
import {
  FriendRequestDto,
  CreateFriendRequestDto
} from "../../dto/friendRequest.dto"

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
    type: FriendRequestDto
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @Post()
  public async create(
    @Req() request: RequestWithUser,
    @Body() friendRequestData: CreateFriendRequestDto
  ): Promise<FriendRequestDto> {
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
  @ApiOkResponse({
    description: "success",
    type: FriendRequestDto,
    isArray: true
  })
  @Get()
  public async index(
    @Req() request: RequestWithUser
  ): Promise<FriendRequestDto[]> {
    const userId = request.user.id
    return await this.retrieveFriendRequestsService.execute(userId)
  }

  @ApiOperation({ description: "deletes a friend request" })
  @ApiOkResponse({
    description: "friend request successfully deleted",
    type: FriendRequestDto
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @Delete("/:id")
  public async delete(
    @Req() request: RequestWithUser,
    @Param("id") id: string
  ): Promise<FriendRequestDto> {
    const userId = request.user.id
    const result = await this.deleteFriendRequestService.execute(userId, id)
    await this.friendRequestsGateway.refresh(userId)
    await this.friendRequestsGateway.refresh(result.receiverId)
    return result
  }
}
