import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { ChartVirsualization, IRecordSpec, VirsualizationVO } from '@undb/core'
import type { EntityManager } from '@undb/sqlite'
import { RecordSqliteAggregateRepository } from '@undb/sqlite'

@Injectable()
export class NestAggregateSqliteQueryModel extends RecordSqliteAggregateRepository {
  constructor(public readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @UseRequestContext()
  async number(tableId: string, virsualization: VirsualizationVO, spec: IRecordSpec | null): Promise<number> {
    return super.number(tableId, virsualization, spec)
  }

  @UseRequestContext()
  async chart(tableId: string, virsualization: ChartVirsualization, spec: IRecordSpec | null): Promise<any> {
    return super.chart(tableId, virsualization, spec)
  }
}
