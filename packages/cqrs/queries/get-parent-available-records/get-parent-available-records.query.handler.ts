import {
  IRecordQueryModel,
  ITableRepository,
  ParentAvailableSpec,
  ParentField,
  ViewId,
  WithRecordTableId,
} from '@egodb/core'
import type { IQueryHandler } from '@egodb/domain'
import { andOptions } from '@egodb/domain'
import { Option } from 'oxide.ts'
import type { IGetParentAvailableRecordsOutput } from './get-parent-available-records.query.interface.js'
import type { GetParentAvailableRecordsQuery } from './get-parent-available-records.query.js'

export class GetParentAvailableRecordsQueryHandler
  implements IQueryHandler<GetParentAvailableRecordsQuery, IGetParentAvailableRecordsOutput>
{
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetParentAvailableRecordsQuery): Promise<IGetParentAvailableRecordsOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const field = table.schema.getFieldByIdOfType(query.parentFieldId, ParentField).unwrap()
    const spec = andOptions(
      table.getSpec(query.viewId),
      Option(WithRecordTableId.fromString(query.tableId).unwrap()),
      Option(new ParentAvailableSpec(query.parentFieldId, query.recordId)),
    ).unwrap()

    const viewId = query.viewId ? ViewId.fromString(query.viewId) : undefined
    const records = await this.rm.find(table, viewId, spec, field)

    return { records }
  }
}
