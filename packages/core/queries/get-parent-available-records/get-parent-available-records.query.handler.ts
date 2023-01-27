import type { IQueryHandler } from '@egodb/domain'
import { andOptions } from '@egodb/domain'
import { Option } from 'oxide.ts'
import type { IRecordQueryModel } from '../../record'
import { ParentAvailableSpec, WithRecordTableId } from '../../record'
import type { ITableRepository } from '../../table.repository'
import type { GetParentAvailableRecordsQuery } from './get-parent-available-records.query'
import type { IGetParentAvailableRecordsOutput } from './get-parent-available-records.query.interface'

export class GetParentAvailableRecordsQueryHandler
  implements IQueryHandler<GetParentAvailableRecordsQuery, IGetParentAvailableRecordsOutput>
{
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetParentAvailableRecordsQuery): Promise<IGetParentAvailableRecordsOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const spec = andOptions(
      table.getSpec(query.viewId),
      Option(WithRecordTableId.fromString(query.tableId).unwrap()),
      Option(new ParentAvailableSpec(query.parentFieldId, query.recordId)),
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
