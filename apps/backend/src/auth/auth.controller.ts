import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Request, Res, UseGuards } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { type Response } from 'express'
import { AuthzGuard } from '../authz/authz.guard.js'
import { AuthService } from './auth.service.js'
import { JwtAuthGuard } from './jwt-auth.guard.js'
import { LocalAuthGuard } from './local-auth.guard.js'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() body: { password: string; email: string }, @Res({ passthrough: true }) res: Response) {
    const payload = await this.authService.register(body.email, body.password)
    const token = this.jwtService.sign(payload)
    res.cookie('undb_auth', token)
    return { access_token: token }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Express.Request, @Res({ passthrough: true }) res: Response) {
    const payload = await this.authService.login(req.user as any)
    const token = this.jwtService.sign(payload)
    res.cookie('undb_auth', token)
    return { access_token: token }
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('undb_auth')
    return { access_token: null }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, AuthzGuard)
  @Get('me')
  getProfile(@Request() req: Express.Request) {
    return this.authService.me(req.user as any)
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateMyProfile(@Request() req: Express.Request, @Body() body: { username: string; avatar: string }) {
    return this.authService.updateProfile((req.user as any).userId, body)
  }
}
