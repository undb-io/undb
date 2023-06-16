import type { IQueryHandler } from '@undb/domain'
import { IWebhookQueryModel, WithWebhookTable } from '@undb/integrations'
import type { IGetWebhooksOutput } from './get-webhooks.query.interface.js'
import type { GetWebhooksQuery } from './get-webhooks.query.js'

export class GetWebhooksQueryHandler implements IQueryHandler<GetWebhooksQuery, IGetWebhooksOutput> {
  constructor(protected readonly rm: IWebhookQueryModel) {}

  async execute(query: GetWebhooksQuery): Promise<IGetWebhooksOutput> {
    const spec = new WithWebhookTable(query.tableId)
    const webhooks = await this.rm.find(spec)

    return {
      webhooks,
    }
  }
}
