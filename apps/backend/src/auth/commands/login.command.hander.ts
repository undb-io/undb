import { LoginCommand, LoginCommandHandler } from '@egodb/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'

@CommandHandler(LoginCommand)
export class NestLgoinCommandHandler extends LoginCommandHandler {
  constructor(jwtService: JwtService) {
    super(jwtService)
  }
}
