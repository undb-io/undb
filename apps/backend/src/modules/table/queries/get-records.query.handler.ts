import type { IGetRecordsOutput } from '@egodb/core'
import { GetRecordsQuery, GetRecordsQueryHandler, IRecordQueryModel } from '@egodb/core'
import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectRecordQueryModel } from '../adapters'

@QueryHandler(GetRecordsQuery)
export class NestGetRecordsQueryHandelr
  extends GetRecordsQueryHandler
  implements IQueryHandler<GetRecordsQuery, IGetRecordsOutput>
{
  constructor(
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
  ) {
    super(rm)
  }
}
