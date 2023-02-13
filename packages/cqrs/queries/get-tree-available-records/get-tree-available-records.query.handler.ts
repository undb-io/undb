import { IRecordQueryModel, ITableRepository, TreeAvailableSpec, WithRecordTableId } from '@egodb/core'
import type { IQueryHandler } from '@egodb/domain'
import { andOptions } from '@egodb/domain'
import { Option } from 'oxide.ts'
import type { IGetTreeAvailableRecordsOutput } from './get-tree-available-records.query.interface.js'
import type { GetTreeAvailableRecordsQuery } from './get-tree-available-records.query.js'

export class GetTreeAvailableRecordsQueryHandler
  implements IQueryHandler<GetTreeAvailableRecordsQuery, IGetTreeAvailableRecordsOutput>
{
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetTreeAvailableRecordsQuery): Promise<IGetTreeAvailableRecordsOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const spec = andOptions(
      table.getSpec(query.viewId),
      Option(WithRecordTableId.fromString(query.tableId).unwrap()),
      Option(new TreeAvailableSpec(query.treeFieldId, query.recordId)),
    ).unwrap()

    const records = await this.rm.find(
      query.tableId,
      spec,
      table.schema.toIdMap(),
      table.mustGetView().sorts?.sorts ?? [],
    )

    return { records }
  }
}
