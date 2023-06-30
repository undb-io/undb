import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import type { IGetShareOutput } from '@undb/cqrs'
import { GetShareQuery, GetShareQueryHandler } from '@undb/cqrs'
import { type IShareQueryModel } from '@undb/integrations'
import { InjectShareQueryModel } from '../adapters/share-sqlite.query-model.js'

@QueryHandler(GetShareQuery)
export class NestGetShareQueryHandler
  extends GetShareQueryHandler
  implements IQueryHandler<GetShareQuery, IGetShareOutput>
{
  constructor(
    @InjectShareQueryModel()
    protected readonly rm: IShareQueryModel,
  ) {
    super(rm)
  }
}
