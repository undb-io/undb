import { CommandHandler } from '@nestjs/cqrs'
import { type BaseRepository } from '@undb/core'
import { CreateBaseCommand, CreateBaseCommandHandler } from '@undb/cqrs'
import { InjectBaseRepository } from '../adapters/base-sqlite.repository.js'

@CommandHandler(CreateBaseCommand)
export class NestCreateBaseCommandHandler extends CreateBaseCommandHandler {
  constructor(
    @InjectBaseRepository()
    repo: BaseRepository,
  ) {
    super(repo)
  }
}
