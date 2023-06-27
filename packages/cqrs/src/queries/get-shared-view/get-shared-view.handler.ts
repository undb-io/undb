import { ViewId, WithRecordTableId, WithTableViewId, type IRecordQueryModel, type ITableQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import { WithShareView, type IShareRepository } from '@undb/integrations'
import type { IGetSharedViewOutput } from './get-shared-view.query.interface.js'
import type { GetSharedViewQuery } from './get-shared-view.query.js'

export class GetSharedViewQueryHandler implements IQueryHandler<GetSharedViewQuery, IGetSharedViewOutput> {
  constructor(
    protected readonly shareRepo: IShareRepository,
    protected readonly tableQueryModel: ITableQueryModel,
    protected readonly rm: IRecordQueryModel,
  ) {}

  async execute(query: GetSharedViewQuery): Promise<IGetSharedViewOutput> {
    const share = (await this.shareRepo.findOne(new WithShareView(query.viewId))).expect('not found share')
    const table = (await this.tableQueryModel.findOne(WithTableViewId.fromString(query.viewId))).unwrap()

    const spec = WithRecordTableId.fromString(table.id).unwrap()
    const records = await this.rm.find(table.id, ViewId.fromString(query.viewId), spec)

    return {
      table,
      records,
    }
  }
}
