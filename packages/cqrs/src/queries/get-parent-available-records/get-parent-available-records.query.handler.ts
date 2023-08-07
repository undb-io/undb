import type { ClsStore, IClsService, IRecordQueryModel, ITableRepository } from '@undb/core'
import { ParentAvailableSpec, ViewId, WithRecordTableId, withQ } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import { andOptions } from '@undb/domain'
import { Option } from 'oxide.ts'
import type { IGetParentAvailableRecordsOutput } from './get-parent-available-records.query.interface.js'
import type { GetParentAvailableRecordsQuery } from './get-parent-available-records.query.js'

export class GetParentAvailableRecordsQueryHandler
  implements IQueryHandler<GetParentAvailableRecordsQuery, IGetParentAvailableRecordsOutput>
{
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly rm: IRecordQueryModel,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(query: GetParentAvailableRecordsQuery): Promise<IGetParentAvailableRecordsOutput> {
    const userId = this.cls.get('user.userId')
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const spec = andOptions(
      table.getSpec(userId, query.viewId),
      Option(WithRecordTableId.fromString(query.tableId).unwrap()),
      Option(new ParentAvailableSpec(query.parentFieldId, query.recordId)),
      withQ(table, query.q),
    ).unwrap()

    const viewId = query.viewId ? ViewId.fromString(query.viewId) : undefined
    const records = await this.rm.find(table.id.value, viewId, spec)

    return { records }
  }
}
