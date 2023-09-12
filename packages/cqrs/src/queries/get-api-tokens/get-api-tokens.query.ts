import { Query } from '@undb/domain'
import type { IGetApiTokensQuery } from './get-api-tokens.query.interface.js'

export class GetApiTokensQuery extends Query {
  constructor(query: IGetApiTokensQuery) {
    super()
  }
}
