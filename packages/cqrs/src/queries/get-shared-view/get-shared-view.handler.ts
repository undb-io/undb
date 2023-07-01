import { WithTableViewId, type ITableQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IShareGuardService } from '@undb/integrations'
import { WithShareView } from '@undb/integrations'
import type { IGetSharedViewOutput } from './get-shared-view.query.interface.js'
import type { GetSharedViewQuery } from './get-shared-view.query.js'

export class GetSharedViewQueryHandler implements IQueryHandler<GetSharedViewQuery, IGetSharedViewOutput> {
  constructor(protected readonly guard: IShareGuardService, protected readonly tableQueryModel: ITableQueryModel) {}

  async execute(query: GetSharedViewQuery): Promise<IGetSharedViewOutput> {
    await this.guard.verify(new WithShareView(query.viewId))

    const table = (await this.tableQueryModel.findOne(WithTableViewId.fromString(query.viewId))).unwrap()

    return {
      table,
    }
  }
}
