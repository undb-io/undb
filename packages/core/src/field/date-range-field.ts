import type { IDateRangeFilter } from '../filter/date-range.filter.js'
import type { IDateRangeFilterOperator } from '../filter/index.js'
import { DateRangeFieldValue } from './date-range-field-value.js'
import type { DateRangeType, ICreateDateRangeFieldSchema, IDateRangeFieldQueryValue } from './date-range-field.type.js'
import { BaseDateField } from './field.base.js'
import type { IDateRangeField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'

export class DateRangeField extends BaseDateField<IDateRangeField> {
  type: DateRangeType = 'date-range'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateDateRangeFieldSchema, 'type'>): DateRangeField {
    return new DateRangeField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateDateRangeFieldSchema): DateRangeField {
    return new DateRangeField(super.unsafeCreateBase(input))
  }

  createValue(value: IDateRangeFieldQueryValue): DateRangeFieldValue {
    return DateRangeFieldValue.fromQuery(value)
  }

  createFilter(operator: IDateRangeFilterOperator, value: [string | null, string | null] | null): IDateRangeFilter {
    return {
      operator,
      value: value ?? [null, null],
      path: this.id.value,
      type: 'date-range',
    }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.dateRange(this)
  }
}
