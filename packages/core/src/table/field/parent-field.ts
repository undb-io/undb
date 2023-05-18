import { andOptions } from '@undb/domain'
import { Mixin } from 'ts-mixer'
import { z } from 'zod'
import type { IParentFilterOperator } from '../filter/operators.js'
import type { IParentFilter } from '../filter/parent.filter.js'
import { AbstractLookingField, AbstractReferenceField } from './field.base.js'
import type { IParentField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { ParentFieldValue } from './parent-field-value.js'
import type { ICreateParentFieldInput, ICreateParentFieldValue, ParentFieldType } from './parent-field.type.js'
import type { IUpdateReferenceFieldInput } from './reference-field.type.js'
import { DisplayFields, FieldId } from './value-objects/index.js'

export class ParentField extends Mixin(AbstractReferenceField<IParentField>, AbstractLookingField<IParentField>) {
  type: ParentFieldType = 'parent'

  override get json() {
    return {
      ...super.json,
      displayFieldIds: this.displayFieldIds.map((id) => id.value),
    }
  }

  override get multiple() {
    return false
  }

  get treeFieldId() {
    return this.props.treeFieldId
  }

  static create(input: Omit<ICreateParentFieldInput, 'type'>): ParentField {
    return new ParentField({
      ...super.createBase(input),
      treeFieldId: FieldId.fromString(input.treeFieldId),
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
    })
  }

  static unsafeCreate(input: ICreateParentFieldInput): ParentField {
    return new ParentField({
      ...super.unsafeCreateBase(input),
      treeFieldId: FieldId.fromString(input.treeFieldId),
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
    })
  }

  public override update(input: IUpdateReferenceFieldInput) {
    return andOptions(this.updateBase(input), this.updateDisplayFieldIds(input.displayFieldIds))
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
