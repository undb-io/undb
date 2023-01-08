import type { IQueryTable, ITableQueryModel, ITableSpec } from '@egodb/core'
import { WithTableId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { Table } from '../../entity'
import { TableSqliteMapper } from './table-sqlite.mapper'
import { TableSqliteQueryVisitor } from './table-sqlite.query-visitor'

export class TableSqliteQueryModel implements ITableQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(): Promise<IQueryTable[]> {
    const tables = await this.em.find(Table, {}, { populate: ['fields'] })
    return tables.map((table) => TableSqliteMapper.entityToQuery(table))
  }

  async findOne(spec: ITableSpec): Promise<Option<IQueryTable>> {
    const qb = this.em.qb(Table)

    const visitor = new TableSqliteQueryVisitor(qb)

    spec.accept(visitor)

    const table = await visitor.qb.getSingleResult()
    if (!table) return None

    await this.em.populate(table, ['fields'])

    return Some(TableSqliteMapper.entityToQuery(table))
  }

  findOneById(id: string): Promise<Option<IQueryTable>> {
    return this.findOne(WithTableId.fromExistingString(id).unwrap())
  }
}
