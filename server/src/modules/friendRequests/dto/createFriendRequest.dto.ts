import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class CreateFriendRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public receiverId: string
}
