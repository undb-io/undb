import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Option, OptionId } from '../../option'
import { Options } from '../../option'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { SelectField } from '../select-field'
import { BaseFieldSpecification } from './base-field.specification'

export class WithOptions extends BaseFieldSpecification<SelectField> {
  constructor(field: SelectField, public readonly options: Options) {
    super(field)
  }

  isSatisfiedBy(): boolean {
    return true
  }

  mutate(t: Table): Result<Table, string> {
    this.field.options = this.options
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.optionsEqual(this)
    return Ok(undefined)
  }
}

export class WithNewOption extends BaseFieldSpecification<SelectField> {
  constructor(field: SelectField, public readonly option: Option) {
    super(field)
  }

  isSatisfiedBy(): boolean {
    return true
  }

  mutate(t: Table): Result<Table, string> {
    this.field.options = new Options([...this.field.options.options, this.option])
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.newOption(this)
    return Ok(undefined)
  }
}

export class WithoutOption extends BaseFieldSpecification<SelectField> {
  constructor(field: SelectField, public readonly optionId: OptionId) {
    super(field)
  }

  isSatisfiedBy(): boolean {
    return true
  }

  mutate(t: Table): Result<Table, string> {
    this.field.options = this.field.options.remove(this.optionId)
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.witoutOption(this)
    return Ok(undefined)
  }
}
