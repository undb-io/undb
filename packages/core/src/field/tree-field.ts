import type { ITreeFilterOperator } from '../filter/operators.js'
import type { ITreeFilter } from '../filter/tree.filter.js'
import { BaseReferenceField } from './field.base.js'
import type { ITreeField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { ParentField } from './parent-field.js'
import { TreeFieldValue } from './tree-field-value.js'
import type { ICreateTreeFieldSchema, ICreateTreeFieldValue, TreeFieldType } from './tree-field.type.js'
import { DisplayFields, FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class TreeField extends BaseReferenceField<ITreeField> {
  type: TreeFieldType = 'tree'

  get parentFieldId() {
    return this.props.parentFieldId
  }

  createParentField(name: string = this.name.value + ' Parent'): ParentField {
    const parentField = ParentField.create({
      name,
      treeFieldId: this.id.value,
      displayFieldIds: this.displayFieldIds.map((f) => f.value),
    })

    this.props.parentFieldId = parentField.id

    return parentField
  }

  static create(input: Omit<ICreateTreeFieldSchema, 'type'>): TreeField {
    const fieldName = FieldName.create(input.name)

    return new TreeField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      parentFieldId: FieldId.fromNullableString(input.parentFieldId),
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateTreeFieldSchema): TreeField {
    return new TreeField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      parentFieldId: FieldId.fromNullableString(input.parentFieldId),
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }

  createValue(value: ICreateTreeFieldValue): TreeFieldValue {
    return new TreeFieldValue(value)
  }

  createFilter(operator: ITreeFilterOperator, value: null): ITreeFilter {
    return { operator, value, path: this.id.value, type: 'tree' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.tree(this)
  }
}
