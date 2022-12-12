import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IRootFilter } from '../filter'
import { RootFilter } from '../filter'
import type { Table } from '../table'
import type { ITableSpecVisitor } from './interface'

export class WithFilters extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly filters: IRootFilter | null, public readonly viewName: string) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    if (!this.filters) {
      return !t.getOrCreateDefaultView(this.viewName).filters
    }
    return t.getOrCreateDefaultView(this.viewName).filters?.equals(new RootFilter(this.filters)) ?? false
  }

  mutate(t: Table): Result<Table, string> {
    const view = t.getOrCreateDefaultView(this.viewName)
    view.setFilters(this.filters)
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.filtersEqual(this)
    return Ok(undefined)
  }
}
