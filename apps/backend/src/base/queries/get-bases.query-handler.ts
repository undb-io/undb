import { QueryHandler } from '@nestjs/cqrs'
import { type IBaseQueryModel } from '@undb/core'
import { GetBasesQuery, GetBasesQueryHandler } from '@undb/cqrs'
import { InjectBaseQueryModel } from '../adapters/base-sqlite.query-model.js'

@QueryHandler(GetBasesQuery)
export class NestGetBasesQueryHandler extends GetBasesQueryHandler {
  constructor(
    @InjectBaseQueryModel()
    rm: IBaseQueryModel,
  ) {
    super(rm)
  }
}
