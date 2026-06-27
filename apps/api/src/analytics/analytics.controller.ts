import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AnalyticsService, Period } from './analytics.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  getOverview(@CurrentUser() user: User, @Query('period') period?: Period) {
    return this.analyticsService.getOverview(user.id, period)
  }
}
