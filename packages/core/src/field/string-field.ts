import type { IStringFilter, IStringFilterOperator } from '../filter/string.filter.js'
import { BaseField } from './field.base.js'
import type { IStringField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { StringFieldValue } from './string-field-value.js'
import type { ICreateStringFieldInput, ICreateStringFieldValue, StringFieldType } from './string-field.type.js'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class StringField extends BaseField<IStringField> {
  type: StringFieldType = 'string'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateStringFieldInput, 'type'>): StringField {
    const fieldName = FieldName.create(input.name)

    return new StringField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateStringFieldInput): StringField {
    return new StringField({
      id: FieldId.fromNullableString(input.id),
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

  accept(visitor: IFieldVisitor): void {
    visitor.string(this)
  }
}
