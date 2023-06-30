import { CommandHandler } from '@nestjs/cqrs'
import { type IUserRepository } from '@undb/core'
import { UpdateProfileCommand, UpdateProfileCommandHandler } from '@undb/cqrs'
import { InjectUserRepository } from '../../core/user/adapters/index.js'

@CommandHandler(UpdateProfileCommand)
export class NestUpdateProfileCommandHandler extends UpdateProfileCommandHandler {
  constructor(@InjectUserRepository() protected readonly repo: IUserRepository) {
    super(repo)
  }
}
