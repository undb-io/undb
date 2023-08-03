import type { ClsStore, IClsService, ITableQueryModel } from '@undb/core'
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
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(query: GetShareViewRecordsQuery): Promise<IGetShareViewRecordsOutput> {
    const userId = this.cls.get('user.userId')
    await this.guard.verify(new WithShareView(query.viewId))

    const table = (await this.tableQueryModel.findOne(WithTableViewId.fromString(query.viewId))).unwrap()
    const tb = TableFactory.fromQuery(table)

    const spec = withTableViewRecordsSpec(tb, userId, query.viewId, query.filter, query.q)
    const records = await this.rm.find(table.id, ViewId.fromString(query.viewId), spec)

    return {
      records,
    }
  }
}
