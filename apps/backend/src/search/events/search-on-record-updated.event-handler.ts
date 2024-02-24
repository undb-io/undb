import { EventsHandler } from '@nestjs/cqrs'
import { RecordUpdatedEvent, type ITableRepository } from '@undb/core'
import { SearchOnRecordUpdatedEventHandler } from '@undb/sqlite'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { NestSearchTableService } from '../search-table.service.js'

@EventsHandler(RecordUpdatedEvent)
export class NestSearchOnRecordUpdatedEventHandler extends SearchOnRecordUpdatedEventHandler {
  constructor(
    @InjectTableRepository()
    repo: ITableRepository,
    svc: NestSearchTableService,
  ) {
    super(repo, svc)
  }
}
