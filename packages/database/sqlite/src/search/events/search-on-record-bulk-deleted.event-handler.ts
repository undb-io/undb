import { ITableRepository, RecordBulkDeletedEvent, RecordFactory } from '@undb/core'
import { IEventHandler } from '@undb/domain'
import { values } from 'lodash-es'
import { SearchTableService } from '../search-table.service.js'

export class SearchOnRecordBulkDeletedEventHandler implements IEventHandler<RecordBulkDeletedEvent, void> {
  constructor(
    private readonly repo: ITableRepository,
    private readonly searchTableService: SearchTableService,
  ) {}

  async handle(event: RecordBulkDeletedEvent): Promise<void> {
    const tableId = event.payload.tableId
    const table = (await this.repo.findOneById(tableId)).unwrap()

    const records = RecordFactory.fromQueryRecords(values(event.meta.records), table.schema.toIdMap())
    await this.searchTableService.onRecordBulkDeleted(table, records)
  }
}
