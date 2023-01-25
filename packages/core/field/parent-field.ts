import type { IParentFilterOperator } from '../filter/operators'
import type { IParentFilter } from '../filter/parent.filter'
import { BaseField } from './field.base'
import type { IParentField } from './field.type'
import type { IFieldVisitor } from './field.visitor'
import { ParentFieldValue } from './parent-field-value'
import type { ICreateParentFieldInput, ICreateParentFieldValue, ParentFieldType } from './parent-field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class ParentField extends BaseField<IParentField> {
  type: ParentFieldType = 'parent'

  set treeFieldId(fieldId: FieldId | undefined) {
    this.props.treeFieldId = fieldId
  }

  static create(input: ICreateParentFieldInput): ParentField {
    const fieldName = FieldName.create(input.name)

    return new ParentField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateParentFieldInput): ParentField {
    return new ParentField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
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
