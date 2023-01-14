import type { IBoolFilter } from '../filter/bool.filter'
import type { IBoolFilterOperator } from '../filter/operators'
import { BoolFieldValue } from './bool-field-value'
import type { BoolFieldType, ICreateBoolFieldInput, ICreateBoolFieldValue } from './bool-field.type'
import { BaseField } from './field.base'
import type { IBoolField } from './field.type'
import { FieldId, FieldKey, FieldName, FieldValueConstraints } from './value-objects'

export class BoolField extends BaseField<IBoolField> {
  type: BoolFieldType = 'bool'

  static create(input: ICreateBoolFieldInput): BoolField {
    const fieldName = FieldName.create(input.name)
    return new BoolField({
      id: FieldId.fromNullableString(input.id),
      key: input.key ? FieldKey.from(input.key) : FieldKey.fromName(fieldName),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateBoolFieldInput): BoolField {
    return new BoolField({
      id: FieldId.fromNullableString(input.id),
      key: FieldKey.from(input.key),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }

  createValue(value: ICreateBoolFieldValue): BoolFieldValue {
    return new BoolFieldValue(value)
  }

  createFilter(operator: IBoolFilterOperator, value: boolean | null): IBoolFilter {
    return { operator, value, path: this.id.value, type: 'bool' }
  }
}
