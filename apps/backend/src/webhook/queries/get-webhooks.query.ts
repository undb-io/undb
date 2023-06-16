import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import type { IGetWebhooksOutput } from '@undb/cqrs'
import { GetWebhooksQuery, GetWebhooksQueryHandler } from '@undb/cqrs'
import { type IWebhookQueryModel } from '@undb/integrations'
import { InjectWebhookQueryModel } from '../adapters/webhook-sqlite.query-model.js'

@QueryHandler(GetWebhooksQuery)
export class NestGetWebhooksQueryHandler
  extends GetWebhooksQueryHandler
  implements IQueryHandler<GetWebhooksQuery, IGetWebhooksOutput>
{
  constructor(
    @InjectWebhookQueryModel()
    protected readonly rm: IWebhookQueryModel,
  ) {
    super(rm)
  }
}
