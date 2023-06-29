import { WithTableViewId, type ITableQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import { WithShareView, type IShareRepository } from '@undb/integrations'
import type { IGetSharedViewOutput } from './get-shared-view.query.interface.js'
import type { GetSharedViewQuery } from './get-shared-view.query.js'

export class GetSharedViewQueryHandler implements IQueryHandler<GetSharedViewQuery, IGetSharedViewOutput> {
  constructor(protected readonly shareRepo: IShareRepository, protected readonly tableQueryModel: ITableQueryModel) {}

  async execute(query: GetSharedViewQuery): Promise<IGetSharedViewOutput> {
    ;(await this.shareRepo.findOne(new WithShareView(query.viewId))).expect('not found share')
    const table = (await this.tableQueryModel.findOne(WithTableViewId.fromString(query.viewId))).unwrap()

    return {
      table,
    }
  }
}
