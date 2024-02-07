import type { EntityManager } from '@mikro-orm/better-sqlite'
import { IRecordRepository, Table } from '@undb/core'
import { IUnitOfWork } from '@undb/domain/dist'
import { SqliteSearchTable } from './search-table'

export interface ISearchService {
  initSearchForTable(table: Table): Promise<void>
}

export class SearchService implements ISearchService {
  constructor(
    protected readonly uow: IUnitOfWork<EntityManager>,
    protected readonly repo: IRecordRepository,
  ) {}

  private get em() {
    return this.uow.conn()
  }

  async initSearchForTable(table: Table): Promise<void> {
    const searchTable = new SqliteSearchTable(table)
    const query = searchTable.getCreateFT5Query()
    const searchableFields = table.schema.searchableFields

    await this.em.execute(query)

    const records = await this.repo.find(table, null)

    await this.em.getKnex().batchInsert(
      searchTable.name,
      records.map((record) => {
        const result: Record<string, string> = {}

        for (const field of searchableFields) {
          const value = record.values.getUnpackedValue(field.id.value).into(null)
          if (value) {
            result[field.id.value] = value.toString()
          }
        }

        return result
      }),
    )
  }
}
