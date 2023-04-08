import { type IUserRepository } from '@egodb/core'
import { RegisterCommand, RegisterCommandHandler } from '@egodb/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectUserRepository } from '../../modules/user/adapters/index.js'

@CommandHandler(RegisterCommand)
export class NestRegisterCommandHandler extends RegisterCommandHandler {
  constructor(@InjectUserRepository() protected readonly repo: IUserRepository) {
    super(repo)
  }
}
