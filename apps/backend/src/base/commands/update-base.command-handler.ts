import { CommandHandler } from '@nestjs/cqrs'
import { type BaseRepository } from '@undb/core'
import { UpdateBaseCommand, UpdateBaseCommandHandler } from '@undb/cqrs'
import { InjectBaseRepository } from '../adapters/base-sqlite.repository.js'

@CommandHandler(UpdateBaseCommand)
export class NestUpdateBaseCommandHandler extends UpdateBaseCommandHandler {
  constructor(
    @InjectBaseRepository()
    repo: BaseRepository,
  ) {
    super(repo)
  }
}
