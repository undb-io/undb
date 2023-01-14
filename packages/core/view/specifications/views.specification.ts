import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { View } from '..'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { ICreateViewsSchema } from '../../table.schema'
import { Views } from '../views'
import { BaseViewSpecification } from './base-view-specification'

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

export class WithTableView extends BaseViewSpecification {
  constructor(public readonly view: View) {
    super(view)
  }

  isSatisfiedBy(t: Table): boolean {
    return t.getView(this.view.key.unpack()).mapOr(false, (v) => v.equals(this.view))
  }

  mutate(t: Table): Result<Table, string> {
    t.views.addView(this.view)
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.viewEqual(this)
    return Ok(undefined)
  }
}
