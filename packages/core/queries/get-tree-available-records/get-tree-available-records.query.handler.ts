import type { IQueryHandler } from '@egodb/domain'
import type { IRecordQueryModel } from '../../record'
import { WithRecordTableId } from '../../record'
import type { ITableRepository } from '../../table.repository'
import type { GetTreeAvailableRecordsQuery } from './get-tree-available-records.query'
import type { IGetTreeAvailableRecordsOutput } from './get-tree-available-records.query.interface'

export class GetTreeAvailableRecordsQueryHandler
  implements IQueryHandler<GetTreeAvailableRecordsQuery, IGetTreeAvailableRecordsOutput>
{
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetTreeAvailableRecordsQuery): Promise<IGetTreeAvailableRecordsOutput> {
    throw new Error('unimplemented')
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const filter = table.getSpec(query.viewId)

    const spec = WithRecordTableId.fromString(query.tableId)
      .map((s) => (filter.isNone() ? s : s.and(filter.unwrap())))
      .unwrap()

    const records = await this.rm.find(spec, table.schema.toIdMap())

    return { records }
  }
}
