import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common'
import { BetsService } from './bets.service'
import { CreateBetDto } from './dto/create-bet.dto'
import { UpdateBetResultDto } from './dto/update-bet-result.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

@Controller('bets')
@UseGuards(JwtAuthGuard)
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  @HttpCode(201)
  create(@CurrentUser() user: User, @Body() dto: CreateBetDto) {
    return this.betsService.createBet(user.id, dto)
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.betsService.findAll(user.id)
  }

  @Get('stats')
  getStats(@CurrentUser() user: User) {
    return this.betsService.getStats(user.id)
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.betsService.findOne(user.id, id)
  }

  @Patch(':id')
  updateResult(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBetResultDto
  ) {
    return this.betsService.updateResult(user.id, id, dto.result)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.betsService.remove(user.id, id)
  }
}
