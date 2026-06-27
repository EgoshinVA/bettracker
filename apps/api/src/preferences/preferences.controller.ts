import { Body, Controller, Get, HttpCode, Patch, UseGuards } from '@nestjs/common'
import { PreferencesService } from './preferences.service'
import { UpdateCurrencyDto } from './dto/update-currency.dto'
import { UpdateTimezoneDto } from './dto/update-timezone.dto'
import { UpdateLanguageDto } from './dto/update-language.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get('currencies')
  getCurrencies() {
    return this.preferencesService.getCurrencies()
  }

  @Get('timezones')
  getTimezones() {
    return this.preferencesService.getTimezones()
  }

  @Get('languages')
  getLanguages() {
    return this.preferencesService.getLanguages()
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyPreferences(@CurrentUser() user: User) {
    return this.preferencesService.getUserPreferences(user.id)
  }

  @Patch('me/currency')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  updateCurrency(@CurrentUser() user: User, @Body() dto: UpdateCurrencyDto) {
    return this.preferencesService.updateCurrency(user.id, dto.currencyId)
  }

  @Patch('me/timezone')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  updateTimezone(@CurrentUser() user: User, @Body() dto: UpdateTimezoneDto) {
    return this.preferencesService.updateTimezone(user.id, dto.timezoneId)
  }

  @Patch('me/language')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  updateLanguage(@CurrentUser() user: User, @Body() dto: UpdateLanguageDto) {
    return this.preferencesService.updateLanguage(user.id, dto.languageId)
  }
}
