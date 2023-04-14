import { QueryHandler } from '@nestjs/cqrs'
import { type IUserQueryModel } from '@undb/core'
import { GetUsersQuery, GetUsersQueryHandler, IGetUsersOutput } from '@undb/cqrs'
import { IQueryHandler } from '@undb/domain'
import { InjectUserQueryModel } from '../adapters/index.js'

@QueryHandler(GetUsersQuery)
export class NestGetUsersQueryHandler
  extends GetUsersQueryHandler
  implements IQueryHandler<GetUsersQuery, IGetUsersOutput>
{
  constructor(@InjectUserQueryModel() protected readonly rm: IUserQueryModel) {
    super(rm)
  }
}
