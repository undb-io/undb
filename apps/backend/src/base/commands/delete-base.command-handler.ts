import { CommandHandler } from '@nestjs/cqrs'
import { type BaseRepository, type ITableRepository } from '@undb/core'
import { DeleteBaseCommand, DeleteBaseCommandHandler } from '@undb/cqrs'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { InjectBaseRepository } from '../adapters/base-sqlite.repository.js'

@CommandHandler(DeleteBaseCommand)
export class NestDeleteBaseCommandHandler extends DeleteBaseCommandHandler {
  constructor(
    @InjectBaseRepository()
    repo: BaseRepository,
    @InjectTableRepository()
    tableRepo: ITableRepository,
  ) {
    super(repo, tableRepo)
  }
}
