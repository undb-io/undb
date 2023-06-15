import { Query } from '@undb/domain'
import type { IGetWebhooksQuery } from './get-webhooks.query.interface.js'

export class GetWebhooksQuery extends Query implements IGetWebhooksQuery {
  readonly tableId: string

  constructor(query: IGetWebhooksQuery) {
    super()
    this.tableId = query.tableId
  }
}
