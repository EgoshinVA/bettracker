import { IsEnum } from 'class-validator'
import { BetResult } from '../entities/bet.entity'

export class UpdateBetResultDto {
  @IsEnum(BetResult)
  result: BetResult
}
