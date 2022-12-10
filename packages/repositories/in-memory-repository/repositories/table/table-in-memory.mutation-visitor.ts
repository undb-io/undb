import type { ITableSpecVisitor, WithFilters, WithName } from '@egodb/core'
import type { TableInMemory } from './table'

export class TableInMemoryMutationVisitor implements ITableSpecVisitor {
  constructor(private table: TableInMemory) {}

  idEqual(): void {
    throw new Error('[TableInMemoryMutationVisitor.idEqual] Method not implemented.')
  }

  nameEqual(s: WithName): void {
    this.table.name = s.name.value
  }

  filtersEqual(s: WithFilters): void {
    const view = this.table.views.find((v) => v.name === s.viewName)
    if (view) {
      view.filters = s.filters
    }
  }
}
