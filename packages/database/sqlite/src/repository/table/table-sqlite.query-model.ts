import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { ITableCache } from '@undb/core'
import { type IQueryTable, type ITableQueryModel, type ITableSpec } from '@undb/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { ReferenceField, Table } from '../../entity/index.js'
import { TableSqliteMapper } from './table-sqlite.mapper.js'
import { TableSqliteQueryVisitor } from './table-sqlite.query-visitor.js'

export class TableSqliteQueryModel implements ITableQueryModel {
  constructor(protected readonly em: EntityManager, protected readonly cache: ITableCache) {}

  async find(): Promise<IQueryTable[]> {
    const tables = await this.em.find(Table, {}, { populate: ['fields.options', 'views', 'fields.displayFields'] })
    return tables.map((table) => TableSqliteMapper.entityToQuery(table))
  }

  async #populateTable(table: Table) {
    await this.em.populate(table, [
      'fields',
      'fields.options',
      'views',
      'fields.displayFields',
      'fields.foreignTable',
      'views.widges.virsualization',
    ])
    for (const field of table.fields) {
      if (field instanceof ReferenceField) {
        if (!field.foreignTable?.fields.isInitialized()) {
          await field.foreignTable?.fields.init()
        }
      }
    }
  }

  async findOne(spec: ITableSpec): Promise<Option<IQueryTable>> {
    const qb = this.em.qb(Table)

    const visitor = new TableSqliteQueryVisitor(qb)

    spec.accept(visitor)

    const table = await visitor.qb.getSingleResult()
    if (!table) return None

    await this.#populateTable(table)

    return Some(TableSqliteMapper.entityToQuery(table))
  }

  async findOneById(id: string): Promise<Option<IQueryTable>> {
    const cached = await this.cache.get(id)
    if (cached) {
      return Some(cached)
    }

    const table = await this.em.findOne(Table, id)
    if (!table) return None

    await this.#populateTable(table)
    const qt = TableSqliteMapper.entityToQuery(table)

    await this.cache.set(id, qt)

    return Some(qt)
  }
}
