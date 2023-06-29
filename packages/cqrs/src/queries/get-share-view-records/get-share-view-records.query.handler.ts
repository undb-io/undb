import type { ITableQueryModel } from '@undb/core'
import { TableFactory, ViewId, WithTableViewId, withTableRecordsSpec, type IRecordQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import { WithShareView, type IShareRepository } from '@undb/integrations'
import type { IGetShareViewRecordsOutput } from './get-share-view-records.query.interface.js'
import type { GetShareViewRecordsQuery } from './get-share-view-records.query.js'

export class GetShareViewRecordsQueryHandler
  implements IQueryHandler<GetShareViewRecordsQuery, IGetShareViewRecordsOutput>
{
  constructor(
    protected readonly shareRepo: IShareRepository,
    protected readonly tableQueryModel: ITableQueryModel,
    protected readonly rm: IRecordQueryModel,
  ) {}

  async execute(query: GetShareViewRecordsQuery): Promise<IGetShareViewRecordsOutput> {
    ;(await this.shareRepo.findOne(new WithShareView(query.viewId))).expect('not found share')

    const table = (await this.tableQueryModel.findOne(WithTableViewId.fromString(query.viewId))).unwrap()
    const tb = TableFactory.fromQuery(table)

    const spec = withTableRecordsSpec(tb, query.viewId)
    const records = await this.rm.find(table.id, ViewId.fromString(query.viewId), spec)

    return {
      records,
    }
  }
}
