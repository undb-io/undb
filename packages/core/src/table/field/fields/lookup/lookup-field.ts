import { Mixin } from 'ts-mixer'
import { z } from 'zod'
import type { IRecordDisplayValues, RecordValueJSON } from '../../../record/index.js'
import { AbstractLookingField, AbstractLookupField, BaseField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { DisplayFields } from '../../value-objects/display-fields.vo.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { LookupFieldValue } from './lookup-field-value.js'
import type { ICreateLookupFieldInput, ICreateLookupFieldValue, ILookupField, LookupType } from './lookup-field.type.js'
import type { ILookupFilter, ILookupFilterOperator } from './lookup.filter.js'

export class LookupField extends Mixin(AbstractLookingField<ILookupField>, AbstractLookupField<ILookupField>) {
  duplicate(name: string): LookupField {
    return LookupField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }

  type: LookupType = 'lookup'
  override get json() {
    return {
      ...super.json,
      referenceFieldId: this.referenceFieldId.value,
      displayFieldIds: this.displayFieldIds.map((id) => id.value),
    }
  }

  get multiple() {
    return true
  }

  override get primitive() {
    return false
  }

  static create(input: Omit<ICreateLookupFieldInput, 'type'>): LookupField {
    return new LookupField({
      ...BaseField.createBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
    })
  }

  static unsafeCreate(input: ICreateLookupFieldInput): LookupField {
    return new LookupField({
      ...BaseField.unsafeCreateBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
    })
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | number | null {
    const value = this.getDisplayValues(displayValues)
    return value.toString()
  }

  createValue(value: ICreateLookupFieldValue): LookupFieldValue {
    return new LookupFieldValue(value)
  }

  createFilter(operator: ILookupFilterOperator, value: string[] | null): ILookupFilter {
    return { operator, value, path: this.id.value, type: 'lookup' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.lookup(this)
  }

  get valueSchema() {
    return z.string().array().nullable()
  }
}
