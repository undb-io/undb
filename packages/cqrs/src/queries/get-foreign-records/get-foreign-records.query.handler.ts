import type { IRecordQueryModel, ITableRepository } from '@undb/core'
import { ViewId, WithRecordTableId, convertFilterSpec } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IGetForeignRecordsOutput } from './get-foreign-records.query.interface.js'
import type { GetForeignRecordsQuery } from './get-foreign-records.query.js'

export class GetForeignRecordsQueryHandler implements IQueryHandler<GetForeignRecordsQuery, IGetForeignRecordsOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetForeignRecordsQuery) {
    const foreignTable = (await this.tableRepo.findOneById(query.foreignTableId)).unwrap()
    const filter = foreignTable.getSpec()

    let spec = WithRecordTableId.fromString(query.foreignTableId)
      .map((s) => (filter.isNone() ? s : s.and(filter.unwrap())))
      .unwrap()

    if (query.filter) {
      const querySpec = convertFilterSpec(query.filter)
      spec = spec.and(querySpec.unwrap())
    }

    const viewId = query.viewId ? ViewId.fromString(query.viewId) : undefined
    const records = await this.rm.find(foreignTable.id.value, viewId, spec)

    return { records }
  }
}
