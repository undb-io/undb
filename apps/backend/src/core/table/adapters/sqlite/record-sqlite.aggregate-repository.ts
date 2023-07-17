import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type { IRecordSpec } from '@undb/core'
import { ChartVisualization, VisualizationVO } from '@undb/core'
import { EntityManager, RecordSqliteAggregateRepository } from '@undb/sqlite'

export const RECORD_AGGREGATE_REPOSITORY = Symbol('RECORD_AGGREGATE_REPOSITORY')
export const InjectRecordAggregateRepositoy = () => Inject(RECORD_AGGREGATE_REPOSITORY)

@Injectable()
export class NestAggregateSqliteQueryModel extends RecordSqliteAggregateRepository {
  constructor(public readonly orm: MikroORM, public readonly em: EntityManager) {
    super(em)
  }

  @UseRequestContext()
  async number(tableId: string, visualization: VisualizationVO, spec: IRecordSpec | null): Promise<number> {
    return super.number(tableId, visualization, spec)
  }

  @UseRequestContext()
  async chart(tableId: string, visualization: ChartVisualization, spec: IRecordSpec | null): Promise<any> {
    return super.chart(tableId, visualization, spec)
  }
}
