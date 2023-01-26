import type { ITreeFilterOperator } from '../filter/operators'
import type { ITreeFilter } from '../filter/tree.filter'
import { BaseField } from './field.base'
import type { ITreeField } from './field.type'
import type { IFieldVisitor } from './field.visitor'
import { ParentField } from './parent-field'
import { TreeFieldValue } from './tree-field-value'
import type { ICreateTreeFieldInput, ICreateTreeFieldValue, TreeFieldType } from './tree-field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class TreeField extends BaseField<ITreeField> {
  type: TreeFieldType = 'tree'

  get parentFieldId() {
    return this.props.parentFieldId
  }

  createParentField(): ParentField {
    const parentField = ParentField.create({
      type: 'parent',
      name: this.name.value + '_parent',
      treeFieldId: this.id.value,
    })

    this.props.parentFieldId = parentField.id

    return parentField
  }

  static create(input: ICreateTreeFieldInput): TreeField {
    const fieldName = FieldName.create(input.name)

    return new TreeField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      parentFieldId: FieldId.fromNullableString(input.parentFieldId),
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateTreeFieldInput): TreeField {
    return new TreeField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      parentFieldId: FieldId.fromNullableString(input.parentFieldId),
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
