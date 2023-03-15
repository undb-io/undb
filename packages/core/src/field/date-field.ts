import type { IDateFilter } from '../filter/date.filter.js'
import type { IDateFilterOperator } from '../filter/index.js'
import { dateBuiltInOperators } from '../filter/operators.js'
import { DateFieldValue } from './date-field-value.js'
import type { DateType, ICreateDateFieldSchema, IDateFieldQueryValue } from './date-field.type.js'
import { BaseDateField } from './field.base.js'
import type { IDateField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'

export class DateField extends BaseDateField<IDateField> {
  type: DateType = 'date'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateDateFieldSchema, 'type'>): DateField {
    return new DateField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateDateFieldSchema): DateField {
    return new DateField(super.unsafeCreateBase(input))
  }

  createValue(value: IDateFieldQueryValue): DateFieldValue {
    return DateFieldValue.fromNullableString(value)
  }

  createFilter(operator: IDateFilterOperator, value: string | null): IDateFilter {
    // built in operators ignore value
    let v = value
    if (dateBuiltInOperators.has(operator)) {
      v = null
    }
    return { operator, value: v, path: this.id.value, type: 'date' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.date(this)
  }
}
