import { z } from 'zod'
import type { IParentFilterOperator } from '../filter/operators.js'
import type { IParentFilter } from '../filter/parent.filter.js'
import { BaseReferenceField } from './field.base.js'
import type { IParentField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { ParentFieldValue } from './parent-field-value.js'
import type { ICreateParentFieldInput, ICreateParentFieldValue, ParentFieldType } from './parent-field.type.js'
import { FieldId } from './value-objects/index.js'

export class ParentField extends BaseReferenceField<IParentField> {
  type: ParentFieldType = 'parent'

  get treeFieldId() {
    return this.props.treeFieldId
  }

  static create(input: Omit<ICreateParentFieldInput, 'type'>): ParentField {
    return new ParentField({
      ...super.createBase(input),
      treeFieldId: FieldId.fromString(input.treeFieldId),
    })
  }

  static unsafeCreate(input: ICreateParentFieldInput): ParentField {
    return new ParentField({
      ...super.unsafeCreateBase(input),
      treeFieldId: FieldId.fromString(input.treeFieldId),
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

  get valueSchema() {
    return this.required ? z.string() : z.string().nullable()
  }
}
