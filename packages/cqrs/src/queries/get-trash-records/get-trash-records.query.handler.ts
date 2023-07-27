import type { IRecordQueryModel, ITableRepository } from '@undb/core'
import { withTableRecordsSpec } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IGetTrashRecordsOutput } from './get-trash-records.query.interface.js'
import type { GetTrashRecordsQuery } from './get-trash-records.query.js'

export class GetTrashRecordsQueryHandler implements IQueryHandler<GetTrashRecordsQuery, IGetTrashRecordsOutput> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly rm: IRecordQueryModel,
  ) {}

  async execute(query: GetTrashRecordsQuery) {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const spec = withTableRecordsSpec(table, query.filter, query.q)

    const { records, total } = await this.rm.findDeletedAndCount(table.id.value, spec)

    return { records, total }
  }
}
