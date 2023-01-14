import { CompositeSpecification } from '@egodb/domain'
import { isAfter, isBefore, isEqual, isToday } from 'date-fns'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { DateFieldValue } from '../../field/date-field-value'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'

abstract class BaseDateSpecification extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(readonly fieldKey: string, readonly value: Date | null) {
    super()
  }

  mutate(r: Record): Result<Record, string> {
    const dateValue = new DateFieldValue(this.value)
    r.values.setValue(this.fieldKey, dateValue)
    return Ok(r)
  }
}

export class DateEqual extends BaseDateSpecification {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getDateValue(this.fieldKey).mapOr(false, (value) => !!this.value && isEqual(value, this.value))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateEqual(this)
    return Ok(undefined)
  }
}

export class DateGreaterThan extends BaseDateSpecification {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getDateValue(this.fieldKey).mapOr(false, (value) => !!this.value && isAfter(value, this.value))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateGreaterThan(this)
    return Ok(undefined)
  }
}

export class DateLessThan extends BaseDateSpecification {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getDateValue(this.fieldKey).mapOr(false, (value) => !!this.value && isBefore(value, this.value))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateLessThan(this)
    return Ok(undefined)
  }
}

export class DateGreaterThanOrEqual extends BaseDateSpecification {
  isSatisfiedBy(r: Record): boolean {
    return r.values
      .getDateValue(this.fieldKey)
      .mapOr(false, (value) => !!this.value && (isAfter(value, this.value) || isEqual(value, this.value)))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateGreaterThanOrEqual(this)
    return Ok(undefined)
  }
}

export class DateLessThanOrEqual extends BaseDateSpecification {
  isSatisfiedBy(r: Record): boolean {
    return r.values
      .getDateValue(this.fieldKey)
      .mapOr(false, (value) => !!this.value && (isBefore(value, this.value) || isEqual(value, this.value)))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateLessThanOrEqual(this)
    return Ok(undefined)
  }
}

export class DateIsToday extends BaseDateSpecification {
  constructor(fieldKey: string) {
    super(fieldKey, null)
  }
  isSatisfiedBy(r: Record): boolean {
    return r.values.getDateValue(this.fieldKey).mapOr(false, (value) => isToday(value))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateIsToday(this)
    return Ok(undefined)
  }
}
