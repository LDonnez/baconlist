import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsEmail } from "class-validator"

export class AuthenticateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password: string
}
