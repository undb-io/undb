import { Injectable } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { NestOutboxService } from '../outbox/outbox.service.js'
import { ReplyEventService } from './reply-event.service.js'

@Injectable()
export class RelayService {
  constructor(
    @InjectPinoLogger(RelayService.name)
    private readonly logger: PinoLogger,
    private readonly outboxService: NestOutboxService,
    private readonly eventBus: EventBus,
    private readonly replyEventService: ReplyEventService,
  ) {}

  async handleCron() {
    await this.outboxService.handle((outboxList) => {
      for (const outbox of outboxList) {
        const event = this.replyEventService.construcEvent(outbox)
        if (!event) {
          this.logger.warn('unknown event name %s', outbox.name)
          continue
        }

        this.eventBus.publish(event)

        this.logger.debug('event %s emitted %j', event.name, event)
      }
    })
  }
}
