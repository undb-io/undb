import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IGetRecordOutput } from '@undb/cqrs'
import { GetRecordQuery, GetRecordQueryHandler } from '@undb/cqrs'
import { InjectRecordQueryModel, InjectTableReposiory } from '../adapters/index.js'

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
