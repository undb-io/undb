import type { EntityManager } from '@mikro-orm/better-sqlite'
import type {
  ChartVirsualization as CoreChartVirsualization,
  NumberVirsualization as CoreNumberVirsualization,
  IVirsualizationVisitor,
} from '@undb/core'
import { Table } from '../../entity/table.js'
import type { Virsualization } from '../../entity/virsualization.js'
import { ChartVirsualization, NumberVirsualization } from '../../entity/virsualization.js'

export class TableSqliteVirsualizationVisitor implements IVirsualizationVisitor {
  constructor(private readonly tableId: string, private readonly em: EntityManager) {}

  public virsualization: Virsualization | undefined

  number(v: CoreNumberVirsualization): void {
    const table = this.em.getReference(Table, this.tableId)
    const nv = new NumberVirsualization(table, v)
    this.virsualization = nv
    this.em.persist(nv)
  }

  chart(v: CoreChartVirsualization): void {
    const table = this.em.getReference(Table, this.tableId)
    const nv = new ChartVirsualization(table, v)
    this.virsualization = nv
    this.em.persist(nv)
  }
}
