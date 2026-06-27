import { IsString, IsOptional, MaxLength, Matches } from 'class-validator'

export class CreateBookmakerDto {
  @IsString()
  @MaxLength(100)
  name: string

  @IsString()
  @MaxLength(10)
  shortName: string

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'color must be a valid hex color (e.g. #7c3aed)' })
  color?: string
}
