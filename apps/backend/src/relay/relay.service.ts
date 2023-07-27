import { Injectable } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { EventFactory } from '@undb/core'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { NestOutboxService } from '../outbox/outbox.service.js'

@Injectable()
export class RelayService {
  constructor(
    @InjectPinoLogger(RelayService.name)
    private readonly logger: PinoLogger,
    private readonly outboxService: NestOutboxService,
    private readonly eventBus: EventBus,
  ) {}

  async handleCron() {
    await this.outboxService.handle((outboxList) => {
      for (const outbox of outboxList) {
        const event = EventFactory.create(
          outbox.uuid,
          outbox.operatorId,
          outbox.name,
          outbox.payload,
          outbox.meta,
          outbox.timestamp,
        )
        if (!event) {
          this.logger.warn('unknown event name %s', outbox.name)
          continue
        }

        this.eventBus.publish(event)

        this.logger.info('event %s emitted %j', event.name, event)
      }
    })
  }
}
