import { EventsHandler } from '@nestjs/cqrs'
import { RecordBulkDeletedEvent, type ITableRepository } from '@undb/core'
import { SearchOnRecordBulkDeletedEventHandler } from '@undb/sqlite'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { NestSearchTableService } from '../search-table.service.js'

@EventsHandler(RecordBulkDeletedEvent)
export class NestSearchOnRecordBulkDeletedEventHandler extends SearchOnRecordBulkDeletedEventHandler {
  constructor(
    @InjectTableRepository()
    repo: ITableRepository,
    svc: NestSearchTableService,
  ) {
    super(repo, svc)
  }
}
