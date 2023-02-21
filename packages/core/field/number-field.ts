import type { INumberFilter, INumberFilterOperator } from '../filter/number.filter.js'
import { BaseField } from './field.base.js'
import type { INumberField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { NumberFieldValue } from './number-field-value.js'
import type { ICreateNumberFieldInput, ICreateNumberFieldValue, NumberType } from './number-field.type.js'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class NumberField extends BaseField<INumberField> {
  type: NumberType = 'number'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateNumberFieldInput, 'type'>): NumberField {
    const fieldName = FieldName.create(input.name)

    return new NumberField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateNumberFieldInput): NumberField {
    return new NumberField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }

  createValue(value: ICreateNumberFieldValue): NumberFieldValue {
    return new NumberFieldValue(value)
  }

  createFilter(operator: INumberFilterOperator, value: number | null): INumberFilter {
    return { operator, value, path: this.id.value, type: 'number' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.number(this)
  }
}
