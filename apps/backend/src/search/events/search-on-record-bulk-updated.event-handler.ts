import { EventsHandler } from '@nestjs/cqrs'
import { RecordBulkUpdatedEvent, type ITableRepository } from '@undb/core'
import { SearchOnRecordBulkUpdatedEventHandler } from '@undb/sqlite'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { NestSearchTableService } from '../search-table.service.js'

@EventsHandler(RecordBulkUpdatedEvent)
export class NestSearchOnRecordBulkUpdatedEventHandler extends SearchOnRecordBulkUpdatedEventHandler {
  constructor(
    @InjectTableRepository()
    repo: ITableRepository,
    svc: NestSearchTableService,
  ) {
    super(repo, svc)
  }
}
