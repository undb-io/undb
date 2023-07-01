import { Query } from '@undb/domain'
import type { IGetSharedViewQuery } from './get-shared-view.query.interface.js'

export class GetSharedViewQuery extends Query implements IGetSharedViewQuery {
  readonly viewId: string
  constructor(query: IGetSharedViewQuery) {
    super()
    this.viewId = query.viewId
  }
}
