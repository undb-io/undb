import type { IQueryTable, ITableQueryModel, ITableSpec } from '@egodb/core'
import { WithTableId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'
import { Table } from '../../entity'
import { TableSqliteMapper } from './table-sqlite.mapper'

export class TableSqliteQueryModel implements ITableQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(): Promise<IQueryTable[]> {
    const tables = await this.em.find(Table, {}, { populate: ['fields'] })
    return tables.map((table) => TableSqliteMapper.entityToQuery(table))
  }

  async findOne(spec: ITableSpec): Promise<Option<IQueryTable>> {
    throw new Error('find one not implemented')
  }

  findOneById(id: string): Promise<Option<IQueryTable>> {
    return this.findOne(WithTableId.fromExistingString(id).unwrap())
  }
}
