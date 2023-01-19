import type { IDateFilterOperator } from '../filter'
import type { IDateFilter } from '../filter/date.filter'
import { dateBuiltInOperators } from '../filter/operators'
import { DateFieldValue } from './date-field-value'
import type { DateType, ICreateDateFieldSchema, ICreateDateFieldValue } from './date-field.type'
import { BaseField } from './field.base'
import type { IDateField } from './field.type'
import type { IFieldVisitor } from './field.visitor'
import { FieldId, FieldKey, FieldName, FieldValueConstraints } from './value-objects'

export class DateField extends BaseField<IDateField> {
  type: DateType = 'date'

  static create(input: ICreateDateFieldSchema): DateField {
    const fieldName = FieldName.create(input.name)
    return new DateField({
      id: FieldId.fromNullableString(input.id),
      key: input.key ? FieldKey.from(input.key) : FieldKey.fromName(fieldName),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateDateFieldSchema): DateField {
    return new DateField({
      id: FieldId.fromNullableString(input.id),
      key: FieldKey.from(input.key),
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
