import { IsString, IsOptional, IsBoolean, MaxLength, Matches } from 'class-validator'

export class UpdateBookmakerDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string

  @IsString()
  @MaxLength(10)
  @IsOptional()
  shortName?: string

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'color must be a valid hex color (e.g. #7c3aed)' })
  color?: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
