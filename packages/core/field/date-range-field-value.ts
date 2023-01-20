import { Option } from 'oxide.ts'
import type { IDateRangeFieldValue } from './date-range-field.type'
import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'

export class DateRangeFieldValue extends FieldValueBase<IDateRangeFieldValue> {
  constructor(value: IDateRangeFieldValue) {
    super(value ? value : { value })
  }

  unpack() {
    return Array.isArray(this.props) ? this.props : null
  }

  get from(): Option<Date> {
    return Option(this.unpack()?.[0])
  }

  get to(): Option<Date> {
    return Option(this.unpack()?.[1])
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.dateRange(this)
  }
}
