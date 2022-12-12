import type { INumberFilter, INumberFilterOperator } from '../filter'
import { BaseField } from './field.base'
import type { INumberField } from './field.type'
import { NumberFieldValue } from './number-field-value'
import type { ICreateNumberFieldInput, ICreateNumberFieldValue, NumberType } from './number-field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class NumberField extends BaseField<INumberField> {
  get type(): NumberType {
    return 'number'
  }

  static create(input: ICreateNumberFieldInput): NumberField {
    return new NumberField({
      id: FieldId.from(input.id),
      name: FieldName.create(input.name),
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateNumberFieldInput): NumberField {
    return new NumberField({
      id: FieldId.from(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }

  createValue(value: ICreateNumberFieldValue): NumberFieldValue {
    return new NumberFieldValue(value)
  }

  createFilter(operator: INumberFilterOperator, value: number | null): INumberFilter {
    return { operator, value, path: this.name.value, type: 'number' }
  }
}
