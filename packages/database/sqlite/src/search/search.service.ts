import type { EntityManager } from '@mikro-orm/better-sqlite'
import { IRecordRepository, ISearchService, Record, Table } from '@undb/core'
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

  async onRecordCreated(table: Table, record: Record): Promise<void> {
    const t = new SqliteSearchTable(table)
    const r = new SearchTableRecord(table, record)

    const query = this.em.getKnex().insert(r.value).into(t.name).toQuery()

    await this.em.execute(query)
  }

  async onRecordUpdated(table: Table, record: Record): Promise<void> {
    const t = new SqliteSearchTable(table)
    const r = new SearchTableRecord(table, record)

    const query = this.em.getKnex().table(t.name).where(t.idField, r.value).update(r.value).toQuery()

    await this.em.execute(query)
  }

  async onRecordDeleted(table: Table, record: Record): Promise<void> {
    const t = new SqliteSearchTable(table)

    const query = this.em.getKnex().table(t.name).where(record.id.value).delete()

    await this.em.execute(query)
  }

  async initSearchForTable(table: Table): Promise<void> {
    const searchTable = new SqliteSearchTable(table)
    const query = searchTable.getCreateFT5Query()

    await this.em.execute(query)
  }
}
