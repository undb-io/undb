import { EventsHandler } from '@nestjs/cqrs'
import { RecordBulkCreatedEvent, type ITableRepository } from '@undb/core'
import { SearchOnRecordBulkCreatedEventHandler } from '@undb/sqlite'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { NestSearchTableService } from '../search-table.service.js'

@EventsHandler(RecordBulkCreatedEvent)
export class NestSearchOnRecordBulkCreatedEventHandler extends SearchOnRecordBulkCreatedEventHandler {
  constructor(
    @InjectTableRepository()
    repo: ITableRepository,
    svc: NestSearchTableService,
  ) {
    super(repo, svc)
  }
}
