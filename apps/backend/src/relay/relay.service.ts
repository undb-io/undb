import { Injectable } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
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
    private readonly eventBus: EventBus,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    await this.outboxService.handle((outboxList) => {
      for (const outbox of outboxList) {
        const event = EventFactory.create(outbox.uuid, outbox.operatorId, outbox.name, outbox.payload)
        if (!event) {
          this.logger.warn('unknown event name %s', outbox.name)
          continue
        }

        const json = event.toJSON()

        this.eventBus.publish(event)
        this.logger.info('event %s emitted %j', event.name, json)
      }
    })
  }
}
