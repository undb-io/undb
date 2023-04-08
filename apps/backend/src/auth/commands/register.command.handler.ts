import { CommandHandler } from '@nestjs/cqrs'
import { type IUserRepository } from '@undb/core'
import { RegisterCommand, RegisterCommandHandler } from '@undb/cqrs'
import { InjectUserRepository } from '../../modules/user/adapters/index.js'

@CommandHandler(RegisterCommand)
export class NestRegisterCommandHandler extends RegisterCommandHandler {
  constructor(@InjectUserRepository() protected readonly repo: IUserRepository) {
    super(repo)
  }
}
