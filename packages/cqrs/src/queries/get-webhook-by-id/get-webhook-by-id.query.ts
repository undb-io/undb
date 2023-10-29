import { Query } from '@undb/domain'
import type { IGetWebhookByIdQuery } from './get-webhook-by-id.query.interface.js'

export class GetWebhookByIdQuery extends Query implements IGetWebhookByIdQuery {
  readonly id: string

  constructor(query: IGetWebhookByIdQuery) {
    super()
    this.id = query.id
  }
}
