import type { IGetRecordOutput } from '@egodb/core'
import { GetRecordQuery, GetRecordQueryHandler, IRecordQueryModel, ITableRepository } from '@egodb/core'
import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectRecordQueryModel, InjectTableReposiory } from '../adapters'

@QueryHandler(GetRecordQuery)
export class NestGetRecordQueryHandelr
  extends GetRecordQueryHandler
  implements IQueryHandler<GetRecordQuery, IGetRecordOutput>
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
