import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"
import { UserDto } from "../../users/dto/user.dto"

export class CreateFriendDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public friendId: string
}

export class FriendDto {
  @ApiProperty()
  public id: string

  @ApiProperty()
  public friendId: string

  @ApiProperty({ type: UserDto })
  public friend: UserDto

  @ApiProperty()
  public userId: string

  @ApiProperty({ type: UserDto })
  public user: UserDto

  @ApiProperty({ required: true })
  public createdAt: Date

  @ApiProperty({ required: true })
  public updatedAt: Date
}
