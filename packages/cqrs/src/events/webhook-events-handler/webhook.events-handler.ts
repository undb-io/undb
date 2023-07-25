import type { RecordEvents } from '@undb/core'
import { EVT_RECORD_ALL } from '@undb/core'
import type { IEventHandler } from '@undb/domain'
import { withTableEvents, type IWebhookHttpService, type IWebhookRepository } from '@undb/integrations'
import type { ILogger } from '@undb/logger'

export class WebhookEventsHandler implements IEventHandler<RecordEvents> {
  constructor(
    protected readonly logger: ILogger,
    protected readonly httpService: IWebhookHttpService,
    protected readonly repo: IWebhookRepository,
  ) {}

  async handle(event: RecordEvents): Promise<void> {
    const tableId = event.payload.tableId
    const spec = withTableEvents(tableId, [EVT_RECORD_ALL, event.name])
    const webhooks = await this.repo.find(spec)

    await this.httpService.send(webhooks, event)
  }
}
