import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SportsService } from './sports.service'
import { SportsController } from './sports.controller'
import { SportsSeeder } from './sports.seeder'
import { Sport } from './entities/sport.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  controllers: [SportsController],
  providers: [SportsService, SportsSeeder],
  exports: [SportsService],
})
export class SportsModule {}
