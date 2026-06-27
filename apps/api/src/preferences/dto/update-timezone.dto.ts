import { IsUUID } from 'class-validator'

export class UpdateTimezoneDto {
  @IsUUID()
  timezoneId: string
}
