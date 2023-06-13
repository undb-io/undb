import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import {
  RecordBulkCreatedEvent,
  RecordBulkDeletedEvent,
  RecordBulkUpdatedEvent,
  RecordCreatedEvent,
  RecordDeletedEvent,
  RecordUpdatedEvent,
} from '@undb/core'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'

@EventsHandler(
  RecordCreatedEvent,
  RecordUpdatedEvent,
  RecordDeletedEvent,
  RecordBulkCreatedEvent,
  RecordBulkDeletedEvent,
  RecordBulkUpdatedEvent,
)
export class WebhookEventHandler
  implements
    IEventHandler<
      | RecordCreatedEvent
      | RecordUpdatedEvent
      | RecordDeletedEvent
      | RecordBulkCreatedEvent
      | RecordBulkDeletedEvent
      | RecordBulkUpdatedEvent
    >
{
  constructor(@InjectPinoLogger() private readonly logger: PinoLogger) {}

  handle(
    event:
      | RecordCreatedEvent
      | RecordUpdatedEvent
      | RecordDeletedEvent
      | RecordBulkCreatedEvent
      | RecordBulkDeletedEvent
      | RecordBulkUpdatedEvent,
  ) {
    this.logger.info('handling event %s of payload %j', event.name, event.payload)
  }
}
