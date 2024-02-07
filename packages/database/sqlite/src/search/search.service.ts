import type { EntityManager } from '@mikro-orm/better-sqlite'
import { IRecordRepository, ISearchService, Table } from '@undb/core'
import { IUnitOfWork } from '@undb/domain'
import { SearchTableRecord } from './earsch-table-record'
import { SqliteSearchTable } from './search-table'

export class SearchService implements ISearchService {
  constructor(
    protected readonly uow: IUnitOfWork<EntityManager>,
    protected readonly repo: IRecordRepository,
  ) {}

  private get em() {
    return this.uow.conn()
  }

  private async initSearchTable(table: Table) {
    const searchTable = new SqliteSearchTable(table)
    const query = searchTable.getCreateFT5Query()

    await this.em.execute(query)
    return searchTable
  }

  private async fillTableRecords(searchTable: SqliteSearchTable, table: Table): Promise<SearchTableRecord[]> {
    const records = await this.repo.find(table, null)
    const srs = records.map((record) => new SearchTableRecord(table, record))

    await this.em.getKnex().batchInsert(
      searchTable.name,
      srs.map((sr) => sr.value),
    )

    return srs
  }

  async initSearchForTable(table: Table): Promise<void> {
    const searchTable = await this.initSearchTable(table)
    await this.fillTableRecords(searchTable, table)
  }
}
