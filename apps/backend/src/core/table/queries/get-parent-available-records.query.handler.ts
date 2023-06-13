import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IGetParentAvailableRecordsOutput } from '@undb/cqrs'
import { GetParentAvailableRecordsQuery, GetParentAvailableRecordsQueryHandler } from '@undb/cqrs'
import { InjectRecordQueryModel, InjectTableRepository } from '../adapters/index.js'

@QueryHandler(GetParentAvailableRecordsQuery)
export class NestGetParentAvailableRecordsQueryHandelr
  extends GetParentAvailableRecordsQueryHandler
  implements IQueryHandler<GetParentAvailableRecordsQuery, IGetParentAvailableRecordsOutput>
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
