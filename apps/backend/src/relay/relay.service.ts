import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Cron, CronExpression } from '@nestjs/schedule'
import { EventFactory } from '@undb/core'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { NestOutboxService } from '../outbox/outbox.service.js'

@Injectable()
export class RelayService {
  constructor(
    @InjectPinoLogger(RelayService.name)
    private readonly logger: PinoLogger,
    private readonly outboxService: NestOutboxService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    await this.outboxService.handle((outboxList) => {
      for (const outbox of outboxList) {
        const event = EventFactory.create(outbox.name, outbox.payload)
        if (!event) continue

        this.eventEmitter.emit(event.name, event.payload)
        this.logger.debug('event %s emitted', event.name)
      }
    })
  }
}
