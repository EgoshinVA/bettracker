import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class RegisterDto {
  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => (value as string).trim())
  name: string
}
