import type { ITableQueryModel } from '@undb/core'
import { TableFactory, ViewId, WithTableViewId, withTableViewRecordsSpec, type IRecordQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IShareGuardService } from '@undb/integrations'
import { WithShareView } from '@undb/integrations'
import type { IGetShareViewRecordsOutput } from './get-share-view-records.query.interface.js'
import type { GetShareViewRecordsQuery } from './get-share-view-records.query.js'

export class GetShareViewRecordsQueryHandler
  implements IQueryHandler<GetShareViewRecordsQuery, IGetShareViewRecordsOutput>
{
  constructor(
    protected readonly guard: IShareGuardService,
    protected readonly tableQueryModel: ITableQueryModel,
    protected readonly rm: IRecordQueryModel,
  ) {}

  async execute(query: GetShareViewRecordsQuery): Promise<IGetShareViewRecordsOutput> {
    await this.guard.verify(new WithShareView(query.viewId))

    const table = (await this.tableQueryModel.findOne(WithTableViewId.fromString(query.viewId))).unwrap()
    const tb = TableFactory.fromQuery(table)

    const spec = withTableViewRecordsSpec(tb, query.viewId, query.filter, query.q)
    const records = await this.rm.find(table.id, ViewId.fromString(query.viewId), spec)

    return {
      records,
    }
  }
}
