import type { IDateFilterOperator } from '../filter'
import type { IDateFilter } from '../filter/date.filter'
import { dateBuiltInOperators } from '../filter/operators'
import { DateFieldValue } from './date-field-value'
import type { DateType, ICreateDateFieldSchema, ICreateDateFieldValue } from './date-field.type'
import { BaseField } from './field.base'
import type { IDateField } from './field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class DateField extends BaseField<IDateField> {
  type: DateType = 'date'

  static create(input: ICreateDateFieldSchema): DateField {
    return new DateField({
      id: FieldId.from(input.id),
      name: FieldName.create(input.name),
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateDateFieldSchema): DateField {
    return new DateField({
      id: FieldId.from(input.id),
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
    return { operator, value: v, path: this.name.value, type: 'date' }
  }
}
