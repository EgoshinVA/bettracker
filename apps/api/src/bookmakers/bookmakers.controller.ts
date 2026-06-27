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
import { BookmakersService } from './bookmakers.service'
import { CreateBookmakerDto } from './dto/create-bookmaker.dto'
import { UpdateBookmakerDto } from './dto/update-bookmaker.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

@Controller('bookmakers')
@UseGuards(JwtAuthGuard)
export class BookmakersController {
  constructor(private readonly bookmakersService: BookmakersService) {}

  @Post()
  @HttpCode(201)
  create(@CurrentUser() user: User, @Body() dto: CreateBookmakerDto) {
    return this.bookmakersService.create(user.id, dto)
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.bookmakersService.findAll(user.id)
  }

  @Get('stats')
  getStats(@CurrentUser() user: User) {
    return this.bookmakersService.getStats(user.id)
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.bookmakersService.findOne(user.id, id)
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookmakerDto,
  ) {
    return this.bookmakersService.update(user.id, id, dto)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.bookmakersService.remove(user.id, id)
  }
}
