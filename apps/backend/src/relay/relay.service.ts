import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { Cron, CronExpression } from '@nestjs/schedule'
import {
  EVT_RECORD_BULK_CREATED,
  EVT_RECORD_BULK_DELETED,
  EVT_RECORD_BULK_UPDATED,
  EVT_RECORD_CREATED,
  EVT_RECORD_DELETED,
  EVT_RECORD_UPDATED,
  EventFactory,
  RecordBulkCreatedEvent,
  RecordBulkDeletedEvent,
  RecordBulkUpdatedEvent,
  RecordCreatedEvent,
  RecordDeletedEvent,
  RecordUpdatedEvent,
} from '@undb/core'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { NestOutboxService } from '../outbox/outbox.service.js'

@Injectable()
export class RelayService {
  constructor(
    @InjectPinoLogger(RelayService.name)
    private readonly logger: PinoLogger,
    private readonly outboxService: NestOutboxService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(EVT_RECORD_CREATED)
  public __TO_BE_REMOVED_ON_RECORD_CREATED(payload: RecordCreatedEvent) {
    this.logger.info('handling event %s %j', EVT_RECORD_CREATED, payload)
  }

  @OnEvent(EVT_RECORD_DELETED)
  public __TO_BE_REMOVED_ON_RECORD_DELETED(payload: RecordDeletedEvent) {
    this.logger.info('handling event %s %j', EVT_RECORD_DELETED, payload)
  }

  @OnEvent(EVT_RECORD_UPDATED)
  public __TO_BE_REMOVED_ON_RECORD_UPDATED(payload: RecordUpdatedEvent) {
    this.logger.info('handling event %s %j', EVT_RECORD_UPDATED, payload)
  }

  @OnEvent(EVT_RECORD_BULK_CREATED)
  public __TO_BE_REMOVED_ON_RECORD_BULK_CREATED(payload: RecordBulkCreatedEvent) {
    this.logger.info('handling event %s %j', EVT_RECORD_BULK_CREATED, payload)
  }

  @OnEvent(EVT_RECORD_BULK_DELETED)
  public __TO_BE_REMOVED_ON_RECORD_BULK_DELETED(payload: RecordBulkDeletedEvent) {
    this.logger.info('handling event %s %j', EVT_RECORD_BULK_DELETED, payload)
  }

  @OnEvent(EVT_RECORD_BULK_UPDATED)
  public __TO_BE_REMOVED_ON_RECORD_BULK_UPDATED(payload: RecordBulkUpdatedEvent) {
    this.logger.info('handling event %s %j', EVT_RECORD_BULK_UPDATED, payload)
  }

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

        this.eventEmitter.emit(event.name, json)
        this.logger.info('event %s emitted %j', event.name, json)
      }
    })
  }
}
