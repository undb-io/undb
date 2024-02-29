import type { EntityManager } from '@mikro-orm/better-sqlite'
import { IRecordRepository, ISearchTableService, Record, Records, Table } from '@undb/core'
import { IUnitOfWork } from '@undb/domain'
import { SqliteSearchTable } from './search-table.js'
import { SearchTableRecord } from './searsch-table-record.js'

export class SearchTableService implements ISearchTableService {
  constructor(
    protected readonly uow: IUnitOfWork<EntityManager>,
    protected readonly repo: IRecordRepository,
  ) {}

  private get em() {
    return this.uow.conn()
  }

  async onRecordCreated(table: Table, record: Record): Promise<void> {
    const t = new SqliteSearchTable(table)
    const r = new SearchTableRecord(t, record)

    const query = this.em.getKnex().insert(r.value).into(t.name).toQuery()

    await this.em.execute(query)
  }

  async onRecordBulkCreated(table: Table, records: Records): Promise<void> {
    const t = new SqliteSearchTable(table)
    const rs = records.map((r) => new SearchTableRecord(t, r))

    const query = this.em
      .getKnex()
      .insert(rs.map((r) => r.value))
      .into(t.name)
      .toQuery()

    await this.em.execute(query)
  }

  async onRecordUpdated(table: Table, record: Record): Promise<void> {
    const t = new SqliteSearchTable(table)
    const r = new SearchTableRecord(t, record)

    const query = this.em.getKnex().table(t.name).where(t.idField, r.value).update(r.value).toQuery()

    await this.em.execute(query)
  }

  async onRecordBulkUpdated(table: Table, records: Records): Promise<void> {
    const t = new SqliteSearchTable(table)
    const rs = records.map((r) => new SearchTableRecord(t, r))

    const queries = rs.map((r) => this.em.getKnex().table(t.name).where(t.idField, r.value).update(r.value).toQuery())

    await Promise.all(queries.map((query) => this.em.execute(query)))
  }

  async onRecordDeleted(table: Table, record: Record): Promise<void> {
    const t = new SqliteSearchTable(table)

    const query = this.em.getKnex().table(t.name).where(record.id.value).delete().toQuery()

    await this.em.execute(query)
  }

  async onRecordBulkDeleted(table: Table, records: Records): Promise<void> {
    const t = new SqliteSearchTable(table)
    const rs = records.map((r) => new SearchTableRecord(t, r))

    const queries = rs.map((r) => this.em.getKnex().table(t.name).where(t.idField, r.value).delete().toQuery())

    await Promise.all(queries.map((query) => this.em.execute(query)))
  }

  async initSearchForTable(table: Table): Promise<void> {
    const searchTable = new SqliteSearchTable(table)
    const query = searchTable.getCreateFT5Query()

    await this.em.execute(query)
  }
}
