import type { TableCompositeSpecification } from '@undb/core'
import { WithTableFormId, WithTableId, WithTableViewId, type ITableQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IShareGuardService, IShareTarget } from '@undb/integrations'
import { withShare } from '@undb/integrations'
import { match } from 'ts-pattern'
import type { IGetSharedTableOutput } from './get-shared-table.query.interface.js'
import type { GetSharedTableQuery } from './get-shared-table.query.js'

export class GetSharedTableQueryHandler implements IQueryHandler<GetSharedTableQuery, IGetSharedTableOutput> {
  constructor(protected readonly guard: IShareGuardService, protected readonly tableQueryModel: ITableQueryModel) {}

  private getSpec(target: IShareTarget, id?: string): TableCompositeSpecification {
    if (id) {
      return WithTableId.fromExistingString(id).unwrap()
    }

    return match(target.type)
      .with('view', () => WithTableViewId.fromString(target.id))
      .with('form', () => WithTableFormId.fromString(target.id))
      .exhaustive()
  }

  async execute(query: GetSharedTableQuery): Promise<IGetSharedTableOutput> {
    await this.guard.verify(withShare(query.target.type, query.target.id))

    const spec = this.getSpec(query.target, query.id)

    const table = (await this.tableQueryModel.findOne(spec)).unwrap()

    return {
      table,
    }
  }
}
