import { ICommandHandler } from '@egodb/domain'
import { CommandHandler } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
import { LoginResponseDTO } from '../../dtos/login.response.dto.js'
import { LoginCommand } from './login.command.js'

@CommandHandler(LoginCommand)
export class LgoinCommandHandler implements ICommandHandler<LoginCommand, LoginResponseDTO> {
  constructor(private readonly jwtService: JwtService) {}
  async execute({ user }: LoginCommand): Promise<LoginResponseDTO> {
    const payload = { username: user.username, sub: user.userId }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
