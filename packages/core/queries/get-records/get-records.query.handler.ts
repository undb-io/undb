import type { IQueryHandler } from '@egodb/domain'
import { convertFilterSpec } from '../../filter'
import type { IRecordQueryModel } from '../../record'
import { WithRecordTableId } from '../../record'
import type { ITableRepository } from '../../table.repository'
import type { GetRecordsQuery } from './get-records.query'
import type { IGetRecordsOutput } from './get-records.query.interface'

export class GetRecordsQueryHandler implements IQueryHandler<GetRecordsQuery, IGetRecordsOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetRecordsQuery): Promise<IGetRecordsOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const filter = table.getSpec(query.viewKey)

    let spec = WithRecordTableId.fromString(query.tableId)
      .map((s) => (filter.isNone() ? s : s.and(filter.unwrap())))
      .unwrap()

    if (query.filter) {
      const querySpec = convertFilterSpec(query.filter)
      spec = spec.and(querySpec.unwrap())
    }

    const records = await this.rm.find(
      table.id.value,
      spec,
      table.schema.toIdMap(),
      table.mustGetView().sorts?.sorts ?? [],
    )

    return { records }
  }
}
