import { IsEnum } from 'class-validator'
import { BetResult } from '@bettracker/shared'

export class UpdateBetResultDto {
  @IsEnum(BetResult)
  result: BetResult
}
