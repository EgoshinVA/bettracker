# @api — NestJS Endpoint Creation

## Order: DTO → Entity → Service → Controller → Module → Tests

## 1. DTO with validation
```ts
export class CreateBetDto {
  @IsString() sport: string
  @IsString() league: string
  @IsString() match: string
  @IsNumber() @Min(1.01) odds: number
  @IsNumber() @Min(0.01) stake: number
  @IsEnum(BetType) betType: BetType
  @IsString() @IsOptional() notes?: string
}
```

## 2. Controller (thin — no logic)
```ts
@Controller('bets')
@UseGuards(JwtAuthGuard)
export class BetsController {
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateBetDto, @CurrentUser() user: User) {
    return this.betsService.createBet(user.id, dto)
  }

  @Get()
  findAll(@CurrentUser() user: User, @Query() query: BetsQueryDto) {
    return this.betsService.findAll(user.id, query)
  }
}
```

## Standard endpoints
- GET    /bets              — list (paginated, filterable)
- POST   /bets              — create
- GET    /bets/:id          — single
- PATCH  /bets/:id          — update result
- DELETE /bets/:id          — delete
- GET    /analytics/summary — ROI, win rate, profit stats

## Response shape
```ts
// Success list: { data: T[], meta: { total, page, limit } }
// Success single: { data: T }
// Error: { statusCode, message, error }
```
