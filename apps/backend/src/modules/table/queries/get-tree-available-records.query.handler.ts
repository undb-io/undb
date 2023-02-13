import { IRecordQueryModel, ITableRepository } from '@egodb/core'
import type { IGetTreeAvailableRecordsOutput } from '@egodb/cqrs'
import { GetTreeAvailableRecordsQuery, GetTreeAvailableRecordsQueryHandler } from '@egodb/cqrs'
import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectRecordQueryModel, InjectTableReposiory } from '../adapters'

@QueryHandler(GetTreeAvailableRecordsQuery)
export class NestGetTreeAvailableRecordsQueryHandelr
  extends GetTreeAvailableRecordsQueryHandler
  implements IQueryHandler<GetTreeAvailableRecordsQuery, IGetTreeAvailableRecordsOutput>
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
