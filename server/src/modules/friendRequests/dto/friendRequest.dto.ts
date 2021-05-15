import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"
import { UserDto } from "../../users/dto/user.dto"

export class FriendRequestDto {
  @ApiProperty()
  public id: string

  @ApiProperty()
  public receiverId: string

  @ApiProperty({ type: UserDto })
  public receiver: UserDto

  @ApiProperty()
  public requesterId: string

  @ApiProperty({ type: UserDto })
  public requester: UserDto

  @ApiProperty({ required: true })
  public createdAt: Date

  @ApiProperty({ required: true })
  public updatedAt: Date
}

export class CreateFriendRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public receiverId: string
}
