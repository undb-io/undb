import { ITableRepository, RecordDeletedEvent, RecordFactory } from '@undb/core'
import { IEventHandler } from '@undb/domain'
import { SearchTableService } from '../search-table.service.js'

export class SearchOnRecordDeletedEventHandler implements IEventHandler<RecordDeletedEvent, void> {
  constructor(
    private readonly repo: ITableRepository,
    private readonly searchTableService: SearchTableService,
  ) {}

  async handle(event: RecordDeletedEvent): Promise<void> {
    const tableId = event.meta.record.tableId
    const table = (await this.repo.findOneById(tableId)).unwrap()

    const record = RecordFactory.fromQuery(event.meta.record, table.schema.toIdMap()).unwrap()
    await this.searchTableService.onRecordDeleted(table, record)
  }
}
