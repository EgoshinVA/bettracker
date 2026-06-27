import { IsUUID } from 'class-validator'

export class UpdateLanguageDto {
  @IsUUID()
  languageId: string
}
