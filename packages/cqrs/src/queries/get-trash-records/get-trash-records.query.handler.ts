import type { ClsStore, IClsService, IRecordQueryModel, ITableRepository } from '@undb/core'
import { withTableRecordsSpec } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IGetTrashRecordsOutput } from './get-trash-records.query.interface.js'
import type { GetTrashRecordsQuery } from './get-trash-records.query.js'

export class GetTrashRecordsQueryHandler implements IQueryHandler<GetTrashRecordsQuery, IGetTrashRecordsOutput> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly rm: IRecordQueryModel,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(query: GetTrashRecordsQuery) {
    const userId = this.cls.get('user.userId')
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const spec = withTableRecordsSpec(table, userId, query.filter, query.q)

    const { records, total } = await this.rm.findDeletedAndCount(table.id.value, spec, { pagination: query.pagination })

    return { records, total }
  }
}
