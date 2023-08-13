import type { ITableRepository, RecordEvents } from '@undb/core'
import type { IEventHandler } from '@undb/domain'
import { withTableEvents, type IWebhookHttpService, type IWebhookRepository } from '@undb/integrations'
import type { ILogger } from '@undb/logger'
import pMap from 'p-map'

export class WebhookEventsHandler implements IEventHandler<RecordEvents> {
  constructor(
    protected readonly logger: ILogger,
    protected readonly httpService: IWebhookHttpService,
    protected readonly repo: IWebhookRepository,
    protected readonly tableRepo: ITableRepository,
  ) {}

  async handle(event: RecordEvents): Promise<void> {
    try {
      const tableId = event.payload.tableId
      const table = (await this.tableRepo.findOneById(tableId)).expect('not found table')

      const spec = withTableEvents(tableId, [event.name])
      const webhooks = await this.repo.find(spec)

      await pMap(
        webhooks,
        async (webhook) => {
          const refinedEvent = webhook.refineEvent(table, event)
          if (refinedEvent.isNone()) {
            this.logger.info('skipping webhook sending')
            return
          }

          await this.httpService.send(webhook, refinedEvent.unwrap())
        },
        { concurrency: 100 },
      )
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
