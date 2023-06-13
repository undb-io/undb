import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IGetRecordsOutput } from '@undb/cqrs'
import { GetRecordsQuery, GetRecordsQueryHandler } from '@undb/cqrs'
import { InjectRecordQueryModel, InjectTableRepository } from '../adapters/index.js'

@QueryHandler(GetRecordsQuery)
export class NestGetRecordsQueryHandelr
  extends GetRecordsQueryHandler
  implements IQueryHandler<GetRecordsQuery, IGetRecordsOutput>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
  ) {
    super(tableRepo, rm)
  }
}
