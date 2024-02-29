import { ITableRepository, RecordBulkUpdatedEvent, RecordFactory } from '@undb/core'
import { IEventHandler } from '@undb/domain'
import { values } from 'lodash-es'
import { SearchTableService } from '../search-table.service.js'

export class SearchOnRecordBulkUpdatedEventHandler implements IEventHandler<RecordBulkUpdatedEvent, void> {
  constructor(
    private readonly repo: ITableRepository,
    private readonly searchTableService: SearchTableService,
  ) {}

  async handle(event: RecordBulkUpdatedEvent): Promise<void> {
    const tableId = event.payload.tableId
    const table = (await this.repo.findOneById(tableId)).unwrap()

    const records = RecordFactory.fromQueryRecords(values(event.meta.records), table.schema.toIdMap())
    await this.searchTableService.onRecordBulkUpdated(table, records)
  }
}
