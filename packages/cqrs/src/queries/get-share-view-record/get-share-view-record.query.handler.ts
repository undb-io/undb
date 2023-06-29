import type { ITableQueryModel } from '@undb/core'
import { WithTableViewId, type IRecordQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import { WithShareView, type IShareRepository } from '@undb/integrations'
import type { IGetShareViewRecordOutput } from './get-share-view-record.query.interface.js'
import type { GetShareViewRecordQuery } from './get-share-view-record.query.js'

export class GetShareViewRecordQueryHandler
  implements IQueryHandler<GetShareViewRecordQuery, IGetShareViewRecordOutput>
{
  constructor(
    protected readonly shareRepo: IShareRepository,
    protected readonly tableQueryModel: ITableQueryModel,
    protected readonly rm: IRecordQueryModel,
  ) {}

  async execute(query: GetShareViewRecordQuery): Promise<IGetShareViewRecordOutput> {
    ;(await this.shareRepo.findOne(new WithShareView(query.viewId))).expect('not found share')
    const table = (await this.tableQueryModel.findOne(WithTableViewId.fromString(query.viewId))).unwrap()

    const record = (await this.rm.findOneById(table.id, query.id)).into()

    return record
  }
}
