import { type IUserQueryModel } from '@egodb/core'
import { GetMeQuery, GetMeQueryHandler } from '@egodb/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectUserQueryModel } from '../../modules/user/adapters/index.js'

@QueryHandler(GetMeQuery)
export class NestGetMeQueryHandler extends GetMeQueryHandler {
  constructor(@InjectUserQueryModel() protected readonly rm: IUserQueryModel) {
    super(rm)
  }
}
