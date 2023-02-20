import type { IReferenceFilterOperator } from '../filter/operators.js'
import type { IReferenceFilter } from '../filter/reference.filter.js'
import { TableId } from '../value-objects/table-id.vo.js'
import { BaseReferenceField } from './field.base.js'
import type { IReferenceField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { ReferenceFieldValue } from './reference-field-value.js'
import type {
  ICreateReferenceFieldInput,
  ICreateReferenceFieldValue,
  ReferenceFieldType,
} from './reference-field.type.js'
import { DisplayFields, FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class ReferenceField extends BaseReferenceField<IReferenceField> {
  type: ReferenceFieldType = 'reference'

  static create(input: Omit<ICreateReferenceFieldInput, 'type'>): ReferenceField {
    const fieldName = FieldName.create(input.name)

    return new ReferenceField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
      foreignTableId: input.foreignTableId ? TableId.from(input.foreignTableId).unwrap() : undefined,
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
    })
  }

  static unsafeCreate(input: ICreateReferenceFieldInput): ReferenceField {
    return new ReferenceField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
      foreignTableId: input.foreignTableId ? TableId.from(input.foreignTableId).unwrap() : undefined,
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
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
