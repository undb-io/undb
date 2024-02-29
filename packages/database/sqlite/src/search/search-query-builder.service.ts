import { Knex } from '@mikro-orm/better-sqlite'
import { ISearchQueryBuilderService } from '@undb/core'

export class SearchQueryBuilderService implements ISearchQueryBuilderService {
  constructor(public readonly qb: Knex.QueryBuilder) {}

  search(keyword: string): void {
    throw new Error('Method not implemented.')
  }
}
