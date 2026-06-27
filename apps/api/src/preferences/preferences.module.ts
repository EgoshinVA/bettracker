import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Currency } from './entities/currency.entity'
import { Timezone } from './entities/timezone.entity'
import { Language } from './entities/language.entity'
import { UserPreferences } from './entities/user-preferences.entity'
import { PreferencesService } from './preferences.service'
import { PreferencesController } from './preferences.controller'
import { PreferencesSeeder } from './preferences.seeder'

@Module({
  imports: [TypeOrmModule.forFeature([Currency, Timezone, Language, UserPreferences])],
  providers: [PreferencesService, PreferencesSeeder],
  controllers: [PreferencesController],
  exports: [PreferencesService],
})
export class PreferencesModule {}
