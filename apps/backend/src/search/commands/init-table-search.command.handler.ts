import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { InitTableSearchCommand, InitTableSearchCommandHandler } from '@undb/cqrs'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { NestSearchService } from '../search.service.js'

@CommandHandler(InitTableSearchCommand)
export class NestInitTableSearchCommandHandler extends InitTableSearchCommandHandler {
  constructor(
    searchService: NestSearchService,
    @InjectTableRepository()
    repo: ITableRepository,
  ) {
    super(searchService, repo)
  }
}
