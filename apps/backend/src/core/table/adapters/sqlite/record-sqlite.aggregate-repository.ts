import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { IRecordSpec } from '@undb/core'
import { ChartVisualization, VisualizationVO } from '@undb/core'
import { EntityManager, RecordSqliteAggregateRepository } from '@undb/sqlite'

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
