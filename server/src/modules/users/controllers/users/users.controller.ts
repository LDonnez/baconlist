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
  Patch,
  UnauthorizedException
} from "@nestjs/common"
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse
} from "@nestjs/swagger"
import { CreateUserService } from "../../services/users/createUser.service"
import { UpdateUserService } from "../../services/users/updateUser.service"
import { CreateUserDto } from "../../dto/createUser.dto"
import { UpdateUserDto } from "../../dto/updateUser.dto"
import { User } from "../../entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { JwtGuard } from "../../../auth/guards/jwtGuard"
import { CurrentUser } from "../../../auth/decorators/currentUser.decorator"
import { Repository } from "typeorm"

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(
    @Inject(CreateUserService)
    private readonly createUserService: CreateUserService,
    @Inject(UpdateUserService)
    private readonly updateUserService: UpdateUserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @ApiOperation({ description: "creates a new user" })
  @ApiOkResponse({ description: "user successfully created", type: User })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @Post()
  public async create(@Body() userData: CreateUserDto): Promise<User> {
    return await this.createUserService.execute(userData)
  }

  @ApiOperation({ description: "returns all users" })
  @ApiOkResponse({ description: "success", type: User, isArray: true })
  @UseGuards(JwtGuard)
  @Get()
  public async index(): Promise<User[]> {
    return await this.userRepository.find()
  }

  @ApiOperation({
    description: "updates an existing user first name and last name"
  })
  @ApiOkResponse({ description: "user successfully updated", type: User })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtGuard)
  @Patch("/:id")
  public async update(
    @Param("id") id: string,
    @CurrentUser() currentUser: User,
    @Body() userData: UpdateUserDto
  ): Promise<User> {
    if (currentUser.id !== id) {
      throw new UnauthorizedException("not allowed")
    }
    return await this.updateUserService.execute(id, userData)
  }
}
