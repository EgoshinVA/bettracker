import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

// Auth endpoints use a strict limit: 10 attempts per minute per IP.
// The global default is 100/min (set in AppModule).
const AUTH_THROTTLE = { default: { limit: 10, ttl: 60_000 } }

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @Throttle(AUTH_THROTTLE)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  @HttpCode(200)
  @Throttle(AUTH_THROTTLE)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('refresh')
  @HttpCode(200)
  @Throttle(AUTH_THROTTLE)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken)
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken)
  }

  // Revoke all sessions — useful for "log out everywhere" or on password change
  @Post('logout-all')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  logoutAll(@CurrentUser() user: User) {
    return this.authService.revokeAllUserTokens(user.id)
  }
}
