import { Query } from '@undb/domain'
import type { IGetRecordAuditsQuery } from './get-record-audits.query.interface.js'

export class GetRecordAuditsQuery extends Query implements IGetRecordAuditsQuery {
  public readonly recordId: string

  constructor(query: IGetRecordAuditsQuery) {
    super()
    this.recordId = query.recordId
  }
}
