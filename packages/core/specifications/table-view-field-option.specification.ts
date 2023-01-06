import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '.'
import type { Table } from '../table'
import type { View } from '../view'
import type { IViewFieldOption } from '../view/view-field-options'
import { DEFAULT_WIDTH } from '../view/view-field-options'

abstract class BaseViewFieldOptionSpec extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly fieldName: string, public readonly viewId: string) {
    super()
  }

  protected getView(t: Table): View {
    return t.mustGetView(this.viewId)
  }

  protected getFieldOption(t: Table): IViewFieldOption {
    return this.getView(t).getFieldOption(this.fieldName)
  }

  protected getOrCreateFieldOption(t: Table): IViewFieldOption {
    return this.getView(t).getOrCreateFieldOption(this.fieldName)
  }
}

export class WithFieldWidth extends BaseViewFieldOptionSpec {
  constructor(fieldName: string, viewId: string, public readonly width: number) {
    super(fieldName, viewId)
  }

  static default(fieldName: string, viewId: string) {
    return new this(fieldName, viewId, DEFAULT_WIDTH)
  }

  isSatisfiedBy(t: Table): boolean {
    return this.getFieldOption(t).width === this.width
  }

  mutate(t: Table): Result<Table, string> {
    this.getOrCreateFieldOption(t).width = this.width
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.fieldWidthEqual(this)
    return Ok(undefined)
  }
}

export class WithFieldVisibility extends BaseViewFieldOptionSpec {
  constructor(fieldName: string, viewId: string, public readonly hidden: boolean) {
    super(fieldName, viewId)
  }
  isSatisfiedBy(t: Table): boolean {
    return this.getView(t).getFieldHidden(this.fieldName) === this.hidden
  }
  mutate(t: Table): Result<Table, string> {
    this.getOrCreateFieldOption(t).hidden = this.hidden
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.fieldVisibility(this)
    return Ok(undefined)
  }
}
