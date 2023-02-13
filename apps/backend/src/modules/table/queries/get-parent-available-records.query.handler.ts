import { IRecordQueryModel, ITableRepository } from '@egodb/core'
import type { IGetParentAvailableRecordsOutput } from '@egodb/cqrs'
import { GetParentAvailableRecordsQuery, GetParentAvailableRecordsQueryHandler } from '@egodb/cqrs'
import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectRecordQueryModel, InjectTableReposiory } from '../adapters'

@QueryHandler(GetParentAvailableRecordsQuery)
export class NestGetParentAvailableRecordsQueryHandelr
  extends GetParentAvailableRecordsQueryHandler
  implements IQueryHandler<GetParentAvailableRecordsQuery, IGetParentAvailableRecordsOutput>
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
