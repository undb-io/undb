import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Option, OptionKey } from '../../option/index.js'
import { Options } from '../../option/index.js'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { IAbstractSelectField, ISelectFieldType } from '../field.type.js'

export class WithOptions extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly type: ISelectFieldType,
    public readonly fieldId: string,
    public readonly options: Options,
  ) {
    super()
  }

  isSatisfiedBy(): boolean {
    return true
  }

  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractSelectField
    field.options = this.options
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.optionsEqual(this)
    return Ok(undefined)
  }
}

export class WithOption extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly type: ISelectFieldType,
    public readonly fieldId: string,
    public readonly option: Option,
  ) {
    super()
  }

  isSatisfiedBy(): boolean {
    return true
  }

  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractSelectField
    field.options = new Options(field.options.options.map((o) => (o.key.equals(this.option.key) ? this.option : o)))
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.optionEqual(this)
    return Ok(undefined)
  }
}
export class WithNewOption extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly type: ISelectFieldType,
    public readonly fieldId: string,
    public readonly option: Option,
  ) {
    super()
  }

  isSatisfiedBy(): boolean {
    return true
  }

  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractSelectField
    field.options = new Options([...field.options.options, this.option])
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.newOption(this)
    return Ok(undefined)
  }
}

export class WithoutOption extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly type: ISelectFieldType,
    public readonly fieldId: string,
    public readonly optionKey: OptionKey,
  ) {
    super()
  }

  isSatisfiedBy(): boolean {
    return true
  }

  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractSelectField
    field.options = field.options.remove(this.optionKey)
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withoutOption(this)
    return Ok(undefined)
  }
}
