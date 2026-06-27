import { IsUUID } from 'class-validator'

export class UpdateCurrencyDto {
  @IsUUID()
  currencyId: string
}
