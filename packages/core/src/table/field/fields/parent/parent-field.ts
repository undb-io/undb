import { Mixin } from 'ts-mixer'
import { z } from 'zod'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues } from '../../../record/record.type.js'
import { AbstractLookingField, AbstractReferenceField } from '../../field.base.js'
import { FieldCannotBeDuplicated } from '../../field.errors.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { DisplayFields, FieldId } from '../../value-objects/index.js'
import { ParentFieldValue } from './parent-field-value.js'
import type {
  ICreateParentFieldInput,
  ICreateParentFieldValue,
  IParentField,
  ParentFieldType,
} from './parent-field.type.js'
import type { IParentFilter, IParentFilterOperator } from './parent.filter.js'

export class ParentField extends Mixin(AbstractReferenceField<IParentField>, AbstractLookingField<IParentField>) {
  duplicate(name: string): ParentField {
    throw new FieldCannotBeDuplicated()
  }
  type: ParentFieldType = 'parent'

  override get json() {
    return {
      ...super.json,
      treeFieldId: this.treeFieldId.value,
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

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    return this.getDisplayValues(displayValues)?.toString() ?? null
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
