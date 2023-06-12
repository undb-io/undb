import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { Cron, CronExpression } from '@nestjs/schedule'
import {
  EVT_RECORD_CREATED,
  EVT_RECORD_DELETED,
  EventFactory,
  RecordCreatedEvent,
  RecordDeletedEvent,
} from '@undb/core'
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

  @OnEvent(EVT_RECORD_CREATED)
  public __TO_BE_REMOVED_ON_RECORD_CREATED(payload: RecordCreatedEvent) {
    this.logger.info('handing event %s %j', EVT_RECORD_CREATED, payload)
  }

  @OnEvent(EVT_RECORD_DELETED)
  public __TO_BE_REMOVED_ON_RECORD_DELETED(payload: RecordDeletedEvent) {
    this.logger.info('handing event %s %j', EVT_RECORD_DELETED, payload)
  }

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
