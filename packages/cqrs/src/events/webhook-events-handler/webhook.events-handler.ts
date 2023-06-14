import type { IRecordEvents } from '@undb/core'
import type { IEventHandler } from '@undb/domain'
import type { ILogger } from '@undb/logger'

export class WebhookEventsHandler implements IEventHandler<IRecordEvents> {
  constructor(protected readonly logger: ILogger) {}

  async handle(event: IRecordEvents): Promise<void> {
    this.logger.info('handling event %s of payload: %j', event.name, event.payload)
  }
}
