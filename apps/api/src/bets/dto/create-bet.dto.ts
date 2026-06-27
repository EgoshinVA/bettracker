import { IsString, IsNumber, Min, IsEnum, IsOptional, IsUUID } from 'class-validator'
import { BetType } from '@bettracker/shared'

export class CreateBetDto {
  @IsString()
  sport: string

  @IsString()
  league: string

  @IsString()
  match: string

  @IsNumber()
  @Min(1.01)
  odds: number

  @IsNumber()
  @Min(0.01)
  stake: number

  @IsEnum(BetType)
  betType: BetType

  @IsString()
  @IsOptional()
  notes?: string

  @IsUUID()
  @IsOptional()
  bookmakerId?: string
}
