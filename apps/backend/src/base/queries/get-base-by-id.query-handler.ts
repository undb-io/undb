import { QueryHandler } from '@nestjs/cqrs'
import { type IBaseQueryModel } from '@undb/core'
import { GetBaseByIdQuery, GetBaseByIdQueryHandler } from '@undb/cqrs'
import { InjectBaseQueryModel } from '../adapters/base-sqlite.query-model.js'

@QueryHandler(GetBaseByIdQuery)
export class NestGetBaseByIdQueryHandler extends GetBaseByIdQueryHandler {
  constructor(
    @InjectBaseQueryModel()
    rm: IBaseQueryModel,
  ) {
    super(rm)
  }
}
