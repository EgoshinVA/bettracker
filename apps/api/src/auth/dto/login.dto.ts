import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class LoginDto {
  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  email: string

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  password: string
}
