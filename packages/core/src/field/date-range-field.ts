import type { IDateRangeFilter } from '../filter/date-range.filter.js'
import type { IDateRangeFilterOperator } from '../filter/index.js'
import { DateRangeFieldValue } from './date-range-field-value.js'
import type { DateRangeType, ICreateDateRangeFieldSchema, ICreateDateRangeFieldValue } from './date-range-field.type.js'
import { BaseDateField } from './field.base.js'
import type { IDateRangeField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { DateFormat, FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class DateRangeField extends BaseDateField<IDateRangeField> {
  type: DateRangeType = 'date-range'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateDateRangeFieldSchema, 'type'>): DateRangeField {
    const fieldName = FieldName.create(input.name)

    return new DateRangeField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  static unsafeCreate(input: ICreateDateRangeFieldSchema): DateRangeField {
    return new DateRangeField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  createValue(value: ICreateDateRangeFieldValue): DateRangeFieldValue {
    return new DateRangeFieldValue(value)
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
