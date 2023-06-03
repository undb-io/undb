import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { IAbstractDateField, IDateFieldType } from '../field.type.js'
import { DateFormat } from '../value-objects/date-format.vo.js'
import { TimeFormat } from '../value-objects/time-format.vo.js'

export class WithFormat extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly type: IDateFieldType,
    public readonly fieldId: string,
    public readonly format: DateFormat,
  ) {
    super()
  }
  static fromString(type: IDateFieldType, fieldId: string, format: string) {
    return new this(type, fieldId, DateFormat.fromString(format))
  }
  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractDateField
    return field.format?.equals(this.format) ?? false
  }
  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractDateField
    field.format = this.format
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFormat(this)
    return Ok(undefined)
  }
}

export class WithTimeFormat extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly type: IDateFieldType,
    public readonly fieldId: string,
    public readonly format: TimeFormat,
  ) {
    super()
  }

  static from(type: IDateFieldType, fieldId: string, format?: string | null) {
    return new this(type, fieldId, TimeFormat.from(format))
  }

  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractDateField
    return field.timeFormat?.equals(this.format) ?? false
  }
  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractDateField
    field.timeFormat = this.format
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withTimeFormat(this)
    return Ok(undefined)
  }
}
