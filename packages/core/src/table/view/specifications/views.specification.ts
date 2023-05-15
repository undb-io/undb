import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { ICreateViewsSchema } from '../../table.schema.js'
import type { ViewName } from '../view-name.vo.js'
import type { ViewVO } from '../view.vo.js'
import { Views } from '../views.js'
import { BaseViewSpecification } from './base-view-specification.js'

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
  constructor(public readonly view: ViewVO) {
    super(view)
  }

  isSatisfiedBy(t: Table): boolean {
    return t.getView(this.view.id.unpack()).mapOr(false, (v) => v.equals(this.view))
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

export class WithNewView extends BaseViewSpecification {
  constructor(public readonly view: ViewVO) {
    super(view)
  }

  isSatisfiedBy(t: Table): boolean {
    return true
  }

  mutate(t: Table): Result<Table, string> {
    t.views.addView(this.view)
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.newView(this)
    return Ok(undefined)
  }
}

export class WithViewName extends BaseViewSpecification {
  constructor(public readonly view: ViewVO, public readonly name: ViewName) {
    super(view)
  }

  isSatisfiedBy(t: Table): boolean {
    return true
  }

  mutate(t: Table): Result<Table, string> {
    this.view.name = this.name
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.viewNameEqual(this)
    return Ok(undefined)
  }
}

export class WithoutView extends BaseViewSpecification {
  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    t.views = new Views(t.views.views.filter((v) => !v.id.equals(this.view.id)))
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withoutView(this)
    return Ok(undefined)
  }
}
