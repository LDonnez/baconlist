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
import { CreateFriendService } from "../../services/friends/createFriend.service"
import { DeleteFriendService } from "../../services/friends/deleteFriend.service"
import { RetrieveFriendsService } from "../../services/friends/retrieveFriends.service"
import { CreateFriendDto, FriendDto } from "../../dto/friend.dto"
import { JwtGuard } from "../../../auth/guards/jwtGuard"
import { RequestWithUser } from "../../../auth/types/requestWithUser"
import { FriendsGateway } from "../../gateways/friends/friends.gateway"

@ApiTags("Friends")
@Controller("friends")
@UseGuards(JwtGuard)
export class FriendsController {
  constructor(
    @Inject(CreateFriendService)
    private readonly createFriendService: CreateFriendService,
    @Inject(DeleteFriendService)
    private readonly deleteFriendService: DeleteFriendService,
    @Inject(RetrieveFriendsService)
    private readonly retrieveFriendsService: RetrieveFriendsService,
    @Inject(FriendsGateway) private readonly friendsGateway: FriendsGateway
  ) {}

  @ApiOperation({ description: "creates a new friend" })
  @ApiOkResponse({
    description: "friend successfully created",
    type: FriendDto
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @Post()
  public async create(
    @Req() request: RequestWithUser,
    @Body() friendData: CreateFriendDto
  ): Promise<FriendDto> {
    const userId = request.user.id
    const result = await this.createFriendService.execute(userId, friendData)
    await this.friendsGateway.refresh(userId)
    await this.friendsGateway.refresh(friendData.friendId)
    return result
  }

  @ApiOperation({ description: "returns all friends from user" })
  @ApiOkResponse({ description: "success", type: FriendDto, isArray: true })
  @Get()
  public async index(@Req() request: RequestWithUser): Promise<FriendDto[]> {
    const userId = request.user.id
    return await this.retrieveFriendsService.execute(userId)
  }

  @ApiOperation({ description: "deletes a friend" })
  @ApiOkResponse({
    description: "friend successfully deleted",
    type: FriendDto
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @Delete("/:id")
  public async delete(
    @Req() request: RequestWithUser,
    @Param("id") id: string
  ): Promise<FriendDto | undefined> {
    const userId = request.user.id
    const result = await this.deleteFriendService.execute(userId, id)
    await this.friendsGateway.refresh(userId)
    await this.friendsGateway.refresh(result.friendId)
    return result
  }
}
