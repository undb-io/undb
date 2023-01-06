import type { IStringFilter, IStringFilterOperator } from '../filter/string.filter'
import { BaseField } from './field.base'
import type { IStringField } from './field.type'
import { StringFieldValue } from './string-field-value'
import type { ICreateStringFieldInput, ICreateStringFieldValue, StringFieldType } from './string-field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class StringField extends BaseField<IStringField> {
  type: StringFieldType = 'string'

  static create(input: ICreateStringFieldInput): StringField {
    const fieldName = FieldName.create(input.name)

    return new StringField({
      id: input.id ? FieldId.from(input.id) : FieldId.fromName(fieldName),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateStringFieldInput): StringField {
    return new StringField({
      id: FieldId.from(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }

  createValue(value: ICreateStringFieldValue): StringFieldValue {
    return new StringFieldValue(value)
  }

  createFilter(operator: IStringFilterOperator, value: string | null): IStringFilter {
    return { operator, value, path: this.id.value, type: 'string' }
  }
}
