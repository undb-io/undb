import { Query } from '@egodb/domain'
import type { IGetRecordQuery } from './get-record.query.interface'

export class GetRecordQuery extends Query implements IGetRecordQuery {
  readonly id: string
  constructor(query: IGetRecordQuery) {
    super()
    this.id = query.id
  }
}
