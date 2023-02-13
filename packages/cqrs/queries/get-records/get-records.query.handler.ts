import { convertFilterSpec, IRecordQueryModel, ITableRepository, WithRecordTableId } from '@egodb/core'
import type { IQueryHandler } from '@egodb/domain'
import type { IGetRecordsOutput } from './get-records.query.interface.js'
import type { GetRecordsQuery } from './get-records.query.js'

export class GetRecordsQueryHandler implements IQueryHandler<GetRecordsQuery, IGetRecordsOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetRecordsQuery): Promise<IGetRecordsOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const filter = table.getSpec(query.viewId)

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
