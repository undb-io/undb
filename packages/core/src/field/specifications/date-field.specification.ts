import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { BaseDateField } from '../field.base.js'
import type { ICreatedAtField, IDateField, IDateRangeField, IUpdatedAtField } from '../field.type.js'
import { DateFormat } from '../value-objects/date-format.vo.js'

export class WithFormat extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly field: BaseDateField<IDateField | IDateRangeField | IUpdatedAtField | ICreatedAtField>,
    public readonly format: DateFormat,
  ) {
    super()
  }
  static fromString(
    field: BaseDateField<IDateField | IDateRangeField | IUpdatedAtField | ICreatedAtField>,
    format: string,
  ) {
    return new this(field, DateFormat.fromString(format))
  }
  isSatisfiedBy(t: Table): boolean {
    return this.field.format?.equals(this.format) ?? false
  }
  mutate(t: Table): Result<Table, string> {
    this.field.format = this.format
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFormat(this)
    return Ok(undefined)
  }
}
