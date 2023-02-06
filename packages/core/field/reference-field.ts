import type { IReferenceFilterOperator } from '../filter/operators'
import type { IReferenceFilter } from '../filter/reference.filter'
import { BaseReferenceField } from './field.base'
import type { IReferenceField } from './field.type'
import type { IFieldVisitor } from './field.visitor'
import { ReferenceFieldValue } from './reference-field-value'
import type { ICreateReferenceFieldInput, ICreateReferenceFieldValue, ReferenceFieldType } from './reference-field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class ReferenceField extends BaseReferenceField<IReferenceField> {
  type: ReferenceFieldType = 'reference'

  static create(input: Omit<ICreateReferenceFieldInput, 'type'>): ReferenceField {
    const fieldName = FieldName.create(input.name)

    return new ReferenceField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateReferenceFieldInput): ReferenceField {
    return new ReferenceField({
      id: FieldId.fromNullableString(input.id),
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

  accept(visitor: IFieldVisitor): void {
    visitor.reference(this)
  }
}
