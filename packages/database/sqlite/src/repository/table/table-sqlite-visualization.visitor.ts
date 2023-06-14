import type { EntityManager } from '@mikro-orm/better-sqlite'
import type {
  ChartVisualization as CoreChartVisualization,
  NumberVisualization as CoreNumberVisualization,
  IVisualizationVisitor,
} from '@undb/core'
import { Table } from '../../entity/table.js'
import type { Visualization } from '../../entity/visualization.js'
import { ChartVisualization, NumberVisualization } from '../../entity/visualization.js'

export class TableSqliteVisualizationVisitor implements IVisualizationVisitor {
  constructor(private readonly tableId: string, private readonly em: EntityManager) {}

  public visualization: Visualization | undefined

  number(v: CoreNumberVisualization): void {
    const table = this.em.getReference(Table, this.tableId)
    const nv = new NumberVisualization(table, v)
    this.visualization = nv
    this.em.persist(nv)
  }

  chart(v: CoreChartVisualization): void {
    const table = this.em.getReference(Table, this.tableId)
    const nv = new ChartVisualization(table, v)
    this.visualization = nv
    this.em.persist(nv)
  }
}
