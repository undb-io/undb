import { CommandHandler } from '@nestjs/cqrs'
import { type BaseRepository, type ITableRepository } from '@undb/core'
import { MoveToBaseCommand, MoveToBaseCommandHandler } from '@undb/cqrs'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { InjectBaseRepository } from '../adapters/base-sqlite.repository.js'

@CommandHandler(MoveToBaseCommand)
export class NestMoveToBaseCommandHandler extends MoveToBaseCommandHandler {
  constructor(
    @InjectTableRepository()
    tableRepo: ITableRepository,
    @InjectBaseRepository()
    repo: BaseRepository,
  ) {
    super(tableRepo, repo)
  }
}
