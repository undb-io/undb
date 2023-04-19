import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service.js'
import { JwtAuthGuard } from './jwt-auth.guard.js'
import { LocalAuthGuard } from './local-auth.guard.js'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() body: { password: string; email: string }) {
    const payload = await this.authService.register(body.email, body.password)
    return { access_token: this.jwtService.sign(payload) }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Express.Request) {
    const payload = await this.authService.login(req.user as any)
    const token = this.jwtService.sign(payload)
    return { access_token: token }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: Express.Request) {
    return this.authService.me(req.user as any)
  }
}
