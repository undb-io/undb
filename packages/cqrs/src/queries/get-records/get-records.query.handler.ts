import type { IRecordQueryModel, ITableRepository } from '@undb/core'
import { ViewId, withTableRecordsSpec } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IGetRecordsOutput } from './get-records.query.interface.js'
import type { GetRecordsQuery } from './get-records.query.js'

export class GetRecordsQueryHandler implements IQueryHandler<GetRecordsQuery, IGetRecordsOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetRecordsQuery) {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const spec = withTableRecordsSpec(table, query.viewId, query.filter, query.q)

    const viewId = query.viewId ? ViewId.fromString(query.viewId) : undefined
    const { records, total } = await this.rm.findAndCount(table.id.value, viewId, spec)

    return { records, total }
  }
}
