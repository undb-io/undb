import type { INumberFilter, INumberFilterOperator } from '../filter/number.filter'
import { Currency } from './currency'
import { BaseField } from './field.base'
import type { INumberField } from './field.type'
import type { IFieldVisitor } from './field.visitor'
import { NumberFieldValue } from './number-field-value'
import type { ICreateNumberFieldInput, ICreateNumberFieldValue, NumberType } from './number-field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class NumberField extends BaseField<INumberField> {
  type: NumberType = 'number'

  static create(input: ICreateNumberFieldInput): NumberField {
    const fieldName = FieldName.create(input.name)

    return new NumberField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
      currency: Currency.fromNullable(input.currency),
    })
  }

  static unsafeCreate(input: ICreateNumberFieldInput): NumberField {
    return new NumberField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
      currency: Currency.fromNullable(input.currency),
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
