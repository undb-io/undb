import { Query } from '@undb/domain'
import type { IGetBasesQuery } from './get-bases.query.interface.js'

export class GetBasesQuery extends Query implements IGetBasesQuery {
  constructor(query: IGetBasesQuery) {
    super()
  }
}
