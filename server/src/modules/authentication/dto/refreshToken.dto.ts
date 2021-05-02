import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class RefreshTokenDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public refreshToken?: string
}
