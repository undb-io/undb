import { Query } from '@undb/domain'
import { IShareTarget } from '@undb/integrations'
import type { IGetSharedTableQuery } from './get-shared-table.query.interface.js'

export class GetSharedTableQuery extends Query implements IGetSharedTableQuery {
  readonly target: IShareTarget
  constructor(query: IGetSharedTableQuery) {
    super()
    this.target = query.target
  }
}
