import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class CreateFriendDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public friendId: string
}
