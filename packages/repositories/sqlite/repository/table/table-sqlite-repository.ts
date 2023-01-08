import type { ITableRepository, ITableSpec, Table } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'
import { Table as TableEntity } from '../../entity'

export class TableSqliteRepository implements ITableRepository {
  constructor(protected readonly em: EntityManager) {}

  async findOneById(id: string): Promise<Option<Table>> {
    const table = await this.em.findOne(TableEntity, id)
    console.log(table)

    throw new Error('Method not implemented.')
  }

  findOne(spec: ITableSpec): Promise<Option<Table>> {
    throw new Error('Method not implemented.')
  }

  find(spec: ITableSpec): Promise<Table[]> {
    throw new Error('Method not implemented.')
  }

  async insert(table: Table): Promise<void> {
    const entity = new TableEntity()
    entity.id = table.id.value
    entity.name = table.name.value

    await this.em.persistAndFlush(entity)
  }

  updateOneById(id: string, spec: ITableSpec): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
