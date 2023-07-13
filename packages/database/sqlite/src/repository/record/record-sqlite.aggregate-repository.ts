import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { ChartVisualization, IChartData, IRecordSpec, VisualizationVO } from '@undb/core'
import { type IRecordAggregateRepository } from '@undb/core'
import { Table } from '../../entity/table.js'
import { TableSqliteMapper } from '../table/table-sqlite.mapper.js'
import { RecordSqliteQueryBuilder } from './record-query.builder.js'

export class RecordSqliteAggregateRepository implements IRecordAggregateRepository {
  constructor(protected readonly em: EntityManager) {}
  async number(tableId: string, visualization: VisualizationVO, spec: IRecordSpec | null): Promise<number> {
    const tableEntity = await this.em.findOneOrFail(Table, tableId, {
      populate: ['fields', 'views', 'forms', 'fields.options', 'views.widgets.visualization'],
    })

    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()

    const builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec)
      .where()
      .aggregate(visualization)
      .build()

    const data = await this.em.execute(builder.qb.first())

    return data[0]?.number ?? 0
  }

  async chart(tableId: string, visualization: ChartVisualization, spec: IRecordSpec | null): Promise<IChartData> {
    const tableEntity = await this.em.findOneOrFail(Table, tableId, {
      populate: ['fields', 'views', 'forms', 'fields.options', 'views.widgets.visualization'],
    })

    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    const builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec)
      .where()
      .aggregate(visualization)
      .build()

    const data = await this.em.execute(builder.qb)
    for (const d of data as IChartData) {
      if (d.meta) {
        d.meta = JSON.parse(d.meta)
      }
    }

    return data as IChartData
  }
}
