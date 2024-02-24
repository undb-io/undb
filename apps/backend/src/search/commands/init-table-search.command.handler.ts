import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { InitTableSearchCommand, InitTableSearchCommandHandler } from '@undb/cqrs'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { NestSearchTableService } from '../search-table.service.js'

@CommandHandler(InitTableSearchCommand)
export class NestInitTableSearchCommandHandler extends InitTableSearchCommandHandler {
  constructor(
    searchService: NestSearchTableService,
    @InjectTableRepository()
    repo: ITableRepository,
  ) {
    super(searchService, repo)
  }
}
