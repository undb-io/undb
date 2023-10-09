import type { IQueryHandler } from '@undb/domain'
import type { IWebhookQueryModel } from '@undb/integrations'
import type { IGetWebhookByIdOutput } from './get-webhook-by-id.query.interface.js'
import type { GetWebhookByIdQuery } from './get-webhook-by-id.query.js'

export class GetWebhookByIdQueryHandler implements IQueryHandler<GetWebhookByIdQuery, IGetWebhookByIdOutput> {
  constructor(protected readonly rm: IWebhookQueryModel) {}

  async execute(query: GetWebhookByIdQuery): Promise<IGetWebhookByIdOutput> {
    const webhook = await this.rm.findOneById(query.id)

    return {
      webhook: webhook.into(null),
    }
  }
}
