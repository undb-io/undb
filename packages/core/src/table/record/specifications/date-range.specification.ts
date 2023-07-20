import { CompositeSpecification } from '@undb/domain'
import { isAfter, isBefore, isEqual } from 'date-fns'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { DateRangeFieldValue } from '../../field/fields/date-range/date-range-field-value.js'
import type { IDateRangeFieldValue } from '../../field/index.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'
import { BaseRecordSpecification } from './record-specification.base.js'

export class DateRangeEqual extends BaseRecordSpecification<DateRangeFieldValue> {
  static from(fieldId: string, value: IDateRangeFieldValue): DateRangeEqual {
    return new this(fieldId, new DateRangeFieldValue(value))
  }

  static fromString(fieldId: string, value: [string | null, string | null]): DateRangeEqual {
    return new this(
      fieldId,
      new DateRangeFieldValue([value[0] ? new Date(value[0]) : null, value[1] ? new Date(value[1]) : null]),
    )
  }

  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)

    return value instanceof DateRangeFieldValue && value.equals(this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeEqual(this)
    return Ok(undefined)
  }
}

export class DateRangeEmpty extends BaseRecordSpecification<DateRangeFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)

    return value instanceof DateRangeFieldValue && value.equals(this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeEmpty(this)
    return Ok(undefined)
  }
}

export abstract class AbstractDateRangeDateSpec extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly field: 'start' | 'end', public readonly fieldId: string, public readonly value: Date) {
    super()
  }

  mutate(t: Record): Result<Record, string> {
    throw new Error('Method not implemented.')
  }

  public getDateValue(r: Record) {
    const value = r.values.value.get(this.fieldId)
    if (value instanceof DateRangeFieldValue) {
      return this.field === 'start' ? value.unpack()?.[0] ?? null : value.unpack()?.[1] ?? null
    }
    return null
  }
}

export class DateRangeDateEqual extends AbstractDateRangeDateSpec {
  isSatisfiedBy(r: Record): boolean {
    const value = this.getDateValue(r)
    if (value === null) return this.value === null
    return isEqual(value, this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeDateEqual(this)
    return Ok(undefined)
  }
}

export class DateRangeDateGreaterThan extends AbstractDateRangeDateSpec {
  isSatisfiedBy(r: Record): boolean {
    const d1 = this.getDateValue(r)
    const d2 = this.value
    return !!d1 && !!d2 && isAfter(d1, d2)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeDateGreaterThan(this)
    return Ok(undefined)
  }
}

export class DateRangeDateLessThan extends AbstractDateRangeDateSpec {
  isSatisfiedBy(r: Record): boolean {
    const d1 = this.getDateValue(r)
    const d2 = this.value
    return !!d1 && !!d2 && isBefore(d1, d2)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeDateLessThan(this)
    return Ok(undefined)
  }
}

export class DateRangeDateGreaterThanOrEqual extends AbstractDateRangeDateSpec {
  isSatisfiedBy(r: Record): boolean {
    const d1 = this.getDateValue(r)
    const d2 = this.value
    return !!d1 && !!d2 && (isEqual(d1, d2) || isAfter(d1, d2))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeDateGreaterThanOrEqual(this)
    return Ok(undefined)
  }
}

export class DateRangeDateLessThanOrEqual extends AbstractDateRangeDateSpec {
  isSatisfiedBy(r: Record): boolean {
    const d1 = this.getDateValue(r)
    const d2 = this.value
    return !!d1 && !!d2 && (isEqual(d1, d2) || isBefore(d1, d2))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeDateLessThanOrEqual(this)
    return Ok(undefined)
  }
}
