import type { ITableSpecVisitor, WithFilter, WithName } from '@egodb/core'
import type { TableInMemory } from './table'

export class TableInMemoryMutationVisitor implements ITableSpecVisitor {
  constructor(private table: TableInMemory) {}

  not(): this {
    return this
  }

  idEqual(): void {
    throw new Error('[TableInMemoryMutationVisitor.idEqual] Method not implemented.')
  }

  nameEqual(s: WithName): void {
    this.table.name = s.name.value
  }

  filterEqual(s: WithFilter): void {
    const view = this.table.views.find((v) => v.name === s.viewName)
    if (view) {
      view.filter = s.filter ?? undefined
    }
  }
}
