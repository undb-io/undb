import type { IParentFilterOperator } from '../filter/operators.js'
import type { IParentFilter } from '../filter/parent.filter.js'
import { BaseReferenceField } from './field.base.js'
import type { IParentField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { ParentFieldValue } from './parent-field-value.js'
import type { ICreateParentFieldInput, ICreateParentFieldValue, ParentFieldType } from './parent-field.type.js'
import { DisplayFields, FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class ParentField extends BaseReferenceField<IParentField> {
  type: ParentFieldType = 'parent'

  get treeFieldId() {
    return this.props.treeFieldId
  }

  static create(input: Omit<ICreateParentFieldInput, 'type'>): ParentField {
    const fieldName = FieldName.create(input.name)

    return new ParentField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      treeFieldId: FieldId.fromString(input.treeFieldId),
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
    })
  }

  static unsafeCreate(input: ICreateParentFieldInput): ParentField {
    return new ParentField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      treeFieldId: FieldId.fromString(input.treeFieldId),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
    })
  }

  createValue(value: ICreateParentFieldValue): ParentFieldValue {
    return new ParentFieldValue(value)
  }

  createFilter(operator: IParentFilterOperator, value: null): IParentFilter {
    return { operator, value, path: this.id.value, type: 'parent' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.parent(this)
  }
}
