import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IRecordSpec } from '@undb/core'
import { type IRecordAggregateRepository } from '@undb/core'
import { Table } from '../../entity/table.js'
import { TableSqliteMapper } from '../table/table-sqlite.mapper.js'
import { RecordSqliteQueryBuilder } from './record-query.builder.js'

export class RecordSqliteAggregateRepository implements IRecordAggregateRepository {
  constructor(protected readonly em: EntityManager) {}
  async number(tableId: string, spec: IRecordSpec | null): Promise<number> {
    const tableEntity = await this.em.findOneOrFail(Table, tableId, { populate: ['fields', 'views'] })
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()

    const builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec).from().where().build()

    const data = await this.em.execute(builder.qb.count('* as number').first())

    return data[0]?.number ?? 0
  }
}
