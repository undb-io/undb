import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { View } from '..'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { IViewFieldOption, ViewFieldOptions } from '../view-field-options'
import { BaseViewSpecification } from './base-view-specification'

abstract class BaseViewFieldOptionSpec extends BaseViewSpecification {
  constructor(public readonly fieldId: string, public readonly view: View) {
    super(view)
  }

  protected getView(t: Table): View {
    return this.view
  }

  protected getFieldOption(t: Table): IViewFieldOption {
    return this.getView(t).getFieldOption(this.fieldId)
  }

  protected getOrCreateFieldOption(t: Table): IViewFieldOption {
    return this.getView(t).getOrCreateFieldOption(this.fieldId)
  }
}

export class WithFieldOption extends BaseViewSpecification {
  constructor(public readonly view: View, public readonly options: ViewFieldOptions) {
    super(view)
  }

  isSatisfiedBy(): boolean {
    return true
  }

  mutate(t: Table): Result<Table, string> {
    this.view.fieldOptions = this.options
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.fieldOptionsEqual(this)
    return Ok(undefined)
  }
}

export class WithFieldWidth extends BaseViewFieldOptionSpec {
  constructor(fieldId: string, view: View, public readonly width: number) {
    super(fieldId, view)
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
  constructor(fieldId: string, view: View, public readonly hidden: boolean) {
    super(fieldId, view)
  }
  isSatisfiedBy(t: Table): boolean {
    return this.getView(t).getFieldHidden(this.fieldId) === this.hidden
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
