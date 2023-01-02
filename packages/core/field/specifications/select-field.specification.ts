import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Option } from '../../option'
import { Options } from '../../option'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { SelectField } from '../select-field'

abstract class BaseSelectFieldSpecification extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: SelectField) {
    super()
  }
}

export class WithOptions extends BaseSelectFieldSpecification {
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

export class WithNewOption extends BaseSelectFieldSpecification {
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
