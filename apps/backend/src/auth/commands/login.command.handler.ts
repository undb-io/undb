import { CommandHandler } from '@nestjs/cqrs'
import { LoginCommand, LoginCommandHandler } from '@undb/cqrs'

@CommandHandler(LoginCommand)
export class NestLgoinCommandHandler extends LoginCommandHandler {}
