import { IsEmail, IsOptional, IsString, Length } from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  @Transform(({ value }: { value: string }) => value?.trim())
  name?: string

  @IsOptional()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  email?: string
}
