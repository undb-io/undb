import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '.'
import type { Table } from '../table'
import type { View } from '../view'
import type { IViewFieldOption } from '../view/view-field-options'
import { DEFAULT_WIDTH } from '../view/view-field-options'

abstract class BaseViewFieldOptionSpec extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly fieldName: string, public readonly viewName: string) {
    super()
  }

  protected getView(t: Table): View {
    return t.getOrCreateDefaultView(this.viewName)
  }

  protected getFieldOption(t: Table): IViewFieldOption {
    return this.getView(t).getFieldOption(this.fieldName)
  }

  protected getOrCreateFieldOption(t: Table): IViewFieldOption {
    return this.getView(t).getOrCreateFieldOption(this.fieldName)
  }
}

export class WithFieldWidth extends BaseViewFieldOptionSpec {
  constructor(fieldName: string, viewName: string, public readonly width: number) {
    super(fieldName, viewName)
  }

  static default(fieldName: string, viewName: string) {
    return new this(fieldName, viewName, DEFAULT_WIDTH)
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
