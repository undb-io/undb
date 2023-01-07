import { CompositeSpecification } from '@egodb/domain'
import { isEqual } from 'date-fns'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { DateRangeFieldValue } from '../../field/date-range-field-value'
import type { IDateRangeFieldValue } from '../../field/date-range-field.type'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'

abstract class BaseDateRangeSpecification extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(readonly fieldId: string, readonly value: IDateRangeFieldValue | null) {
    super()
  }

  mutate(r: Record): Result<Record, string> {
    const dateRangeValue = new DateRangeFieldValue(this.value)
    r.values.setValue(this.fieldId, dateRangeValue)
    return Ok(r)
  }
}

export class DateRangeEqual extends BaseDateRangeSpecification {
  isSatisfiedBy(r: Record): boolean {
    return r.values
      .getDateRangeValue(this.fieldId)
      .mapOr(
        false,
        (value) => !!value && !!this.value && isEqual(value[0], this.value[0]) && isEqual(value[1], this.value[1]),
      )
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeEqual(this)
    return Ok(undefined)
  }
}
