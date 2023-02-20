import { IRecordQueryModel, ITableRepository } from '@egodb/core'
import type { IGetForeignRecordsOutput } from '@egodb/cqrs'
import { GetForeignRecordsQuery, GetForeignRecordsQueryHandler } from '@egodb/cqrs'
import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectRecordQueryModel, InjectTableReposiory } from '../adapters'

@QueryHandler(GetForeignRecordsQuery)
export class NestGetForeignRecordsQueryHandelr
  extends GetForeignRecordsQueryHandler
  implements IQueryHandler<GetForeignRecordsQuery, IGetForeignRecordsOutput>
{
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
  ) {
    super(tableRepo, rm)
  }
}
