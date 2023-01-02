import { ValueObject } from '@egodb/domain'
import { isDate } from 'date-fns'
import type { IDateRangeFieldValue } from './date-range-field.type'

export class DateRangeFieldValue extends ValueObject<IDateRangeFieldValue> {
  constructor(value: IDateRangeFieldValue) {
    super(value ? value : { value })
  }

  static isDateRange(value: unknown): value is IDateRangeFieldValue {
    return Array.isArray(value) && value.length === 2 && isDate(value[0]) && isDate(value[1])
  }

  unpack() {
    return Array.isArray(this.props) ? this.props : null
  }
}
