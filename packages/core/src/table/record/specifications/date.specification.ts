import { CompositeSpecification } from '@undb/domain'
import { isAfter, isBefore, isEqual, isToday, isTomorrow, isWithinInterval, isYesterday } from 'date-fns'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { DateFieldValue } from '../../field/index.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'
import { BaseRecordSpecification } from './record-specification.base.js'

export class DateEqual extends BaseRecordSpecification<DateFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    return value instanceof DateFieldValue && this.value.equals(value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateEqual(this)
    return Ok(undefined)
  }
}

export class DateGreaterThan extends BaseRecordSpecification<DateFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof DateFieldValue)) return false

    const d1 = value.unpack()
    const d2 = this.value.unpack()
    return !!d1 && !!d2 && isAfter(d1, d2)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateGreaterThan(this)
    return Ok(undefined)
  }
}

export class DateLessThan extends BaseRecordSpecification<DateFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof DateFieldValue)) return false

    const d1 = value.unpack()
    const d2 = this.value.unpack()
    return !!d1 && !!d2 && isBefore(d1, d2)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateLessThan(this)
    return Ok(undefined)
  }
}

export class DateGreaterThanOrEqual extends BaseRecordSpecification<DateFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof DateFieldValue)) return false

    const d1 = value.unpack()
    const d2 = this.value.unpack()
    return !!d1 && !!d2 && (isEqual(d1, d2) || isAfter(d1, d2))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateGreaterThanOrEqual(this)
    return Ok(undefined)
  }
}

export class DateLessThanOrEqual extends BaseRecordSpecification<DateFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof DateFieldValue)) return false

    const d1 = value.unpack()
    const d2 = this.value.unpack()
    return !!d1 && !!d2 && (isEqual(d1, d2) || isBefore(d1, d2))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateLessThanOrEqual(this)
    return Ok(undefined)
  }
}

export class DateIsToday extends BaseRecordSpecification<DateFieldValue> {
  constructor(fieldId: string) {
    super(fieldId, new DateFieldValue(null))
  }

  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof DateFieldValue)) return false

    const date = value.unpack()

    return !!date && isToday(date)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateIsToday(this)
    return Ok(undefined)
  }
}

export class DateIsTomorrow extends BaseRecordSpecification<DateFieldValue> {
  constructor(fieldId: string) {
    super(fieldId, new DateFieldValue(null))
  }

  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof DateFieldValue)) return false

    const date = value.unpack()

    return !!date && isTomorrow(date)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateIsTomorrow(this)
    return Ok(undefined)
  }
}

export class DateIsYesterday extends BaseRecordSpecification<DateFieldValue> {
  constructor(fieldId: string) {
    super(fieldId, new DateFieldValue(null))
  }

  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof DateFieldValue)) return false

    const date = value.unpack()

    return !!date && isYesterday(date)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateIsYesterday(this)
    return Ok(undefined)
  }
}

export class DateBetween extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(
    public readonly fieldId: string,
    public readonly date1: Date,
    public readonly date2: Date,
  ) {
    super()
  }

  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof DateFieldValue)) return false

    const date = value.unpack()

    return !!date && isWithinInterval(date, { start: this.date1, end: this.date2 })
  }

  mutate(): Result<Record, string> {
    throw new Error('Method not implemented.')
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateBetween(this)
    return Ok(undefined)
  }
}
