import { ValueObject } from '@egodb/domain'
import type { IDateRangeFieldValue } from './date-range-field.type'

export class DateRangeFieldValue extends ValueObject<IDateRangeFieldValue> {
  constructor(value: IDateRangeFieldValue) {
    super(value ? value : { value })
  }

  unpack() {
    return Array.isArray(this.props) ? this.props : null
  }
}
