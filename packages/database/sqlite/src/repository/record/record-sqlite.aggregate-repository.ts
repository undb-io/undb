import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IRecordSpec, VirsualizationVO } from '@undb/core'
import { NumberVirsualization, type IRecordAggregateRepository } from '@undb/core'
import { Table } from '../../entity/table.js'
import { TableSqliteMapper } from '../table/table-sqlite.mapper.js'
import { RecordSqliteQueryBuilder } from './record-query.builder.js'

export class RecordSqliteAggregateRepository implements IRecordAggregateRepository {
  constructor(protected readonly em: EntityManager) {}
  async number(tableId: string, virsualization: VirsualizationVO, spec: IRecordSpec | null): Promise<number> {
    const tableEntity = await this.em.findOneOrFail(Table, tableId, {
      populate: ['fields', 'views', 'fields.options', 'views.widges.virsualization'],
    })

    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()

    const aggregateFunction =
      virsualization instanceof NumberVirsualization ? virsualization.numberAggregateFunction : undefined
    const fieldId = virsualization instanceof NumberVirsualization ? virsualization.fieldId?.value : undefined
    const builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec)
      .from()
      .where()
      .aggregate(aggregateFunction, fieldId)
      .build()

    const data = await this.em.execute(builder.qb.first())

    return data[0]?.number ?? 0
  }
}
