import { Query } from '@undb/domain'
import type { IGetBasesQuery } from './get-bases.query.interface.js'

export class GetBasesQuery extends Query implements IGetBasesQuery {
  public readonly q?: string
  constructor(query: IGetBasesQuery) {
    super()
    this.q = query.q
  }
}
