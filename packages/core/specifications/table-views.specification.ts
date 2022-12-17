import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '.'
import type { Table } from '../table'
import type { ICreateViewsSchema } from '../table.schema'
import { Views } from '../view/views'

export class WithTableViews extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly views: Views) {
    super()
  }

  static from(input: ICreateViewsSchema): WithTableViews {
    const views = Views.create(input)
    return new this(views)
  }

  isSatisfiedBy(t: Table): boolean {
    return this.views.equals(t.views)
  }

  mutate(t: Table): Result<Table, string> {
    t.views = this.views.views.length ? this.views : t.createDefaultViews()
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.viewsEqual(this)
    return Ok(undefined)
  }
}
