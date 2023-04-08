import { LoginCommand, LoginCommandHandler } from '@egodb/cqrs'
import { CommandHandler } from '@nestjs/cqrs'

@CommandHandler(LoginCommand)
export class NestLgoinCommandHandler extends LoginCommandHandler {}
