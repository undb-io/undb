import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IDateRangeFieldValue } from '../../field'
import { DateRangeFieldValue } from '../../field/date-range-field-value'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'
import { BaseRecordSpecification } from './record-specification.base'

export class DateRangeEqual extends BaseRecordSpecification<DateRangeFieldValue> {
  static from(fieldId: string, value: IDateRangeFieldValue): DateRangeEqual {
    return new this(fieldId, new DateRangeFieldValue(value))
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
