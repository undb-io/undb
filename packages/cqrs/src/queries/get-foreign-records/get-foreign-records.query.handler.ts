import type { ClsStore, IClsService, IRecordQueryModel, ITableRepository } from '@undb/core'
import { ViewId, withTableRecordsSpec } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IGetForeignRecordsOutput } from './get-foreign-records.query.interface.js'
import type { GetForeignRecordsQuery } from './get-foreign-records.query.js'

export class GetForeignRecordsQueryHandler implements IQueryHandler<GetForeignRecordsQuery, IGetForeignRecordsOutput> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly rm: IRecordQueryModel,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(query: GetForeignRecordsQuery) {
    const userId = this.cls.get('user.userId')
    const foreignTable = (await this.tableRepo.findOneById(query.foreignTableId)).unwrap()

    const spec = withTableRecordsSpec(foreignTable, userId, query.filter, query.q)

    const viewId = query.viewId ? ViewId.fromString(query.viewId) : undefined
    const records = await this.rm.find(foreignTable.id.value, viewId, spec)

    return { records }
  }
}
