import { CompositeSpecification } from '@egodb/domain'
import { isEmpty } from '@fxts/core'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IRootFilter } from '../filter'
import { RootFilter } from '../filter'
import type { Table } from '../table'
import type { ITableSpecVisitor } from './interface'

export class WithFilter extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly filter: IRootFilter | null, public readonly viewName: string) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    if (!this.filter) {
      return isEmpty(t.getOrCreateDefaultView(this.viewName).filter)
    }
    return t.getOrCreateDefaultView(this.viewName).filter?.equals(new RootFilter(this.filter)) ?? false
  }

  mutate(t: Table): Result<Table, string> {
    const view = t.getOrCreateDefaultView(this.viewName)
    view.setFilter(this.filter)
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.filterEqual(this)
    return Ok(undefined)
  }
}
