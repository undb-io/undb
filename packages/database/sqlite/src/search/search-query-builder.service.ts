import { Knex } from '@mikro-orm/better-sqlite'
import { INTERNAL_COLUMN_ID_NAME, ISearchQueryBuilderService, Table } from '@undb/core'
import { TABLE_ALIAS } from '../repository/record/record.constants.js'
import { SqliteSearchTable } from './search-table.js'

export class SearchQueryBuilderService implements ISearchQueryBuilderService {
  constructor(
    public readonly table: Table,
    public readonly qb: Knex.QueryBuilder,
  ) {}

  public get searchTable() {
    return new SqliteSearchTable(this.table)
  }

  search(keyword: string): void {
    const st = this.searchTable
    this.qb
      .join(st.name, `${st.name}.${st.idField}`, `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`)
      .whereRaw(`${st.name} MATCH '${keyword}*'`)
  }
}
