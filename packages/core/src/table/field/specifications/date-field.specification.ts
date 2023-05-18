import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { AbstractDateField } from '../field.base.js'
import { DateFormat } from '../value-objects/date-format.vo.js'
import { TimeFormat } from '../value-objects/time-format.vo.js'

export class WithFormat extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: AbstractDateField, public readonly format: DateFormat) {
    super()
  }
  static fromString(field: AbstractDateField, format: string) {
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

export class WithTimeFormat extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: AbstractDateField, public readonly format: TimeFormat) {
    super()
  }
  static from(field: AbstractDateField, format?: string | null) {
    return new this(field, TimeFormat.from(format))
  }
  isSatisfiedBy(t: Table): boolean {
    return this.field.timeFormat?.equals(this.format) ?? false
  }
  mutate(t: Table): Result<Table, string> {
    this.field.timeFormat = this.format
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withTimeFormat(this)
    return Ok(undefined)
  }
}
