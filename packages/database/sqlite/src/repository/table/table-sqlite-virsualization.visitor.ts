import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { NumberVirsualization as CoreNumberVirsualization, IVirsualizationVisitor } from '@undb/core'
import { Table } from '../../entity/table.js'
import type { Virsualization } from '../../entity/virsualization.js'
import { NumberVirsualization } from '../../entity/virsualization.js'

export class TableSqliteVirsualizationVisitor implements IVirsualizationVisitor {
  constructor(private readonly tableId: string, private readonly em: EntityManager) {}

  public virsualization: Virsualization | undefined

  number(v: CoreNumberVirsualization): void {
    const table = this.em.getReference(Table, this.tableId)
    const nv = new NumberVirsualization(table, v)
    this.virsualization = nv
    this.em.persist(nv)
  }
}
