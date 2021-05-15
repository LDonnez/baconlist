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
import { User } from "@prisma/client"
import { JwtGuard } from "../../../auth/guards/jwtGuard"
import { CurrentUser } from "../../../auth/decorators/currentUser.decorator"
import { PrismaService } from "../../../prisma/prisma.service"
import { UserDto, CreateUserDto, UpdateUserDto } from "../../dto/user.dto"

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(
    @Inject(CreateUserService)
    private readonly createUserService: CreateUserService,
    @Inject(UpdateUserService)
    private readonly updateUserService: UpdateUserService,
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  @ApiOperation({ description: "creates a new user" })
  @ApiOkResponse({ description: "user successfully created", type: UserDto })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @Post()
  public async create(@Body() userData: CreateUserDto): Promise<UserDto> {
    return await this.createUserService.execute(userData)
  }

  @ApiOperation({ description: "returns all users" })
  @ApiOkResponse({ description: "success", type: UserDto, isArray: true })
  @UseGuards(JwtGuard)
  @Get()
  public async index(): Promise<UserDto[]> {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  @ApiOperation({
    description: "updates an existing user first name and last name"
  })
  @ApiOkResponse({ description: "user successfully updated", type: UserDto })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtGuard)
  @Patch("/:id")
  public async update(
    @Param("id") id: string,
    @CurrentUser() currentUser: User,
    @Body() userData: UpdateUserDto
  ): Promise<UserDto> {
    if (currentUser.id !== id) {
      throw new UnauthorizedException("not allowed")
    }
    return await this.updateUserService.execute(id, userData)
  }
}
