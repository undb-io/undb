import { QueryHandler } from '@nestjs/cqrs'
import { type IUserQueryModel } from '@undb/core'
import { GetMeQuery, GetMeQueryHandler } from '@undb/cqrs'
import { InjectUserQueryModel } from '../../modules/user/adapters/index.js'

@QueryHandler(GetMeQuery)
export class NestGetMeQueryHandler extends GetMeQueryHandler {
  constructor(@InjectUserQueryModel() protected readonly rm: IUserQueryModel) {
    super(rm)
  }
}
