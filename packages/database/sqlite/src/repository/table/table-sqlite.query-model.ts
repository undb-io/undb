import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IQueryTable, ITableQueryModel, ITableSpec } from '@undb/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { ReferenceField, Table } from '../../entity/index.js'
import { TableSqliteMapper } from './table-sqlite.mapper.js'
import { TableSqliteQueryVisitor } from './table-sqlite.query-visitor.js'

export class TableSqliteQueryModel implements ITableQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(): Promise<IQueryTable[]> {
    const tables = await this.em.find(Table, {}, { populate: ['fields.options', 'views', 'fields.displayFields'] })
    return tables.map((table) => TableSqliteMapper.entityToQuery(table))
  }

  async #populateTable(table: Table) {
    await this.em.populate(table, ['fields.options', 'views', 'fields.displayFields', 'fields.foreignTable'])
    for (const field of table.fields) {
      if (field instanceof ReferenceField) {
        await field.foreignTable?.fields?.init({ where: { display: true } })
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
    const table = await this.em.findOne(Table, id)
    if (!table) return None

    await this.#populateTable(table)
    return Some(TableSqliteMapper.entityToQuery(table))
  }
}
