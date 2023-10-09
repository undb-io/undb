import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import type { IGetWebhookByIdOutput } from '@undb/cqrs'
import { GetWebhookByIdQuery, GetWebhookByIdQueryHandler } from '@undb/cqrs'
import { type IWebhookQueryModel } from '@undb/integrations'
import { InjectWebhookQueryModel } from '../adapters/webhook-sqlite.query-model.js'

@QueryHandler(GetWebhookByIdQuery)
export class NestGetWebhookByIdQueryHandler
  extends GetWebhookByIdQueryHandler
  implements IQueryHandler<GetWebhookByIdQuery, IGetWebhookByIdOutput>
{
  constructor(
    @InjectWebhookQueryModel()
    protected readonly rm: IWebhookQueryModel,
  ) {
    super(rm)
  }
}
