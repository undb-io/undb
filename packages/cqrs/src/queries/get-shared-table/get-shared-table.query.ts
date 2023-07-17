import { Query } from '@undb/domain'
import type { IShareTarget } from '@undb/integrations'
import type { IGetSharedTableQuery } from './get-shared-table.query.interface.js'

export class GetSharedTableQuery extends Query implements IGetSharedTableQuery {
  readonly target: IShareTarget
  readonly id?: string

  constructor(query: IGetSharedTableQuery) {
    super()
    this.target = query.target
    this.id = query.id
  }
}
