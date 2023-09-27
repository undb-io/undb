import { Query } from '@undb/domain'
import type { IGetBaseByIdQuery } from './get-base-by-id.query.interface.js'

export class GetBaseByIdQuery extends Query implements IGetBaseByIdQuery {
  public readonly id: string
  constructor(query: IGetBaseByIdQuery) {
    super()
    this.id = query.id
  }
}
