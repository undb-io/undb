import { IQueryHandler } from '@egodb/domain'
import { ITableRepository } from '../../repository'
import { GetTableQuery } from './get-table.query'
import { IGetTableOutput } from './get-table.query.interface'

export class GetTableQueryHandler implements IQueryHandler<GetTableQuery, IGetTableOutput> {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(query: GetTableQuery): Promise<IGetTableOutput> {
    await this.repo.findOneById(query.id)

    return { id: query.id }
  }
}
