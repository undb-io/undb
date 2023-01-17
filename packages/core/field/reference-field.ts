import type { IReferenceFilterOperator } from '../filter/operators'
import type { IReferenceFilter } from '../filter/reference.filter'
import { BaseField } from './field.base'
import type { IReferenceField } from './field.type'
import { ReferenceFieldValue } from './reference-field-value'
import type { ICreateReferenceFieldInput, ICreateReferenceFieldValue, ReferenceFieldType } from './reference-field.type'
import { FieldId, FieldKey, FieldName, FieldValueConstraints } from './value-objects'

export class ReferenceField extends BaseField<IReferenceField> {
  type: ReferenceFieldType = 'reference'

  static create(input: ICreateReferenceFieldInput): ReferenceField {
    const fieldName = FieldName.create(input.name)

    return new ReferenceField({
      id: FieldId.fromNullableString(input.id),
      key: input.key ? FieldKey.from(input.key) : FieldKey.fromName(fieldName),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateReferenceFieldInput): ReferenceField {
    return new ReferenceField({
      id: FieldId.fromNullableString(input.id),
      key: FieldKey.from(input.key),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }

  createValue(value: ICreateReferenceFieldValue): ReferenceFieldValue {
    return new ReferenceFieldValue(value)
  }

  createFilter(operator: IReferenceFilterOperator, value: null): IReferenceFilter {
    return { operator, value, path: this.id.value, type: 'reference' }
  }
}
