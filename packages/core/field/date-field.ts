import type { IDateFilter } from '../filter/date.filter.js'
import type { IDateFilterOperator } from '../filter/index.js'
import { dateBuiltInOperators } from '../filter/operators.js'
import { DateFieldValue } from './date-field-value.js'
import type { DateType, ICreateDateFieldSchema, ICreateDateFieldValue } from './date-field.type.js'
import { BaseField } from './field.base.js'
import type { IDateField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class DateField extends BaseField<IDateField> {
  type: DateType = 'date'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateDateFieldSchema, 'type'>): DateField {
    const fieldName = FieldName.create(input.name)
    return new DateField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateDateFieldSchema): DateField {
    return new DateField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }

  createValue(value: ICreateDateFieldValue): DateFieldValue {
    return new DateFieldValue(value)
  }

  createFilter(operator: IDateFilterOperator, value: Date | null): IDateFilter {
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
