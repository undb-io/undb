import type { IEventHandler } from '@nestjs/cqrs'
import { EventsHandler } from '@nestjs/cqrs'
import type { ClsStore, ITableRepository, RecordEvents } from '@undb/core'
import { RecordEventsClasses, isAnonymous } from '@undb/core'
import { WebhookEventsHandler } from '@undb/cqrs'
import { type IWebhookHttpService, type IWebhookRepository } from '@undb/integrations'
import { ClsService } from 'nestjs-cls'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { InjectWebhookRepository } from '../adapters/webhook-sqlite.repository.js'
import { InjectWebhookHttpService } from '../providers.js'

@EventsHandler(...RecordEventsClasses)
export class NestWebhookEventHandler extends WebhookEventsHandler implements IEventHandler<RecordEvents> {
  constructor(
    @InjectPinoLogger()
    protected readonly logger: PinoLogger,
    @InjectWebhookHttpService()
    protected readonly webhookHttpService: IWebhookHttpService,
    @InjectWebhookRepository()
    protected readonly repo: IWebhookRepository,
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,

    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(logger, webhookHttpService, repo, tableRepo)
  }

  async handle(event: RecordEvents): Promise<void> {
    await this.cls.run(async () => {
      const operatorId = event.operatorId
      this.cls.set('user.userId', operatorId)
      this.cls.set('user.isAnonymous', isAnonymous(operatorId))
      await super.handle(event)
    })
  }
}
