import {
  GetTableQuery,
  GetTableQueryHandler as DomainHandler,
  IGetTableOutput,
  type ITableRepository,
} from '@egodb/core'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@QueryHandler(GetTableQuery)
export class GetTableQueryHandelr extends DomainHandler implements IQueryHandler<GetTableQuery, IGetTableOutput> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
