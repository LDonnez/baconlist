import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsEmail } from "class-validator"
import { IsSameAs } from "../validators/isSameAs"

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public firstName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public lastName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsSameAs("password", { message: "password is not confirmed" })
  public passwordConfirmation: string
}
