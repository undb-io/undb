import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IGetForeignRecordsOutput } from '@undb/cqrs'
import { GetForeignRecordsQuery, GetForeignRecordsQueryHandler } from '@undb/cqrs'
import { InjectRecordQueryModel, InjectTableRepository } from '../adapters/index.js'

@QueryHandler(GetForeignRecordsQuery)
export class NestGetForeignRecordsQueryHandler
  extends GetForeignRecordsQueryHandler
  implements IQueryHandler<GetForeignRecordsQuery, IGetForeignRecordsOutput>
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
