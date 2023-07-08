import { z } from 'zod'
import type { IRecordDisplayValues, RecordValueJSON } from '../../../record/index.js'
import { AbstractLookupField, BaseField } from '../../field.base.js'
import type { Field } from '../../field.type.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { MinFieldValue } from './min-field-value.js'
import type { MinType, IMinField, ICreateMinFieldInput, ICreateMinFieldValue } from './min-field.type.js'
import type { IMinFilter, IMinFilterOperator } from './min.filter.js'

export class MinField extends AbstractLookupField<IMinField> {
  duplicate(name: string): Field {
    return MinField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }

  type: MinType = 'min'

  override get json() {
    return {
      ...super.json,
      referenceFieldId: this.referenceFieldId.value,
    }
  }

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateMinFieldInput, 'type'>): MinField {
    return new MinField({
      ...BaseField.createBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
    })
  }

  static unsafeCreate(input: ICreateMinFieldInput): MinField {
    return new MinField({
      ...BaseField.unsafeCreateBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
    })
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): number | null {
    return valueJson[this.id.value] ?? null
  }

  createValue(value: ICreateMinFieldValue): MinFieldValue {
    return new MinFieldValue(value)
  }

  createFilter(operator: IMinFilterOperator, value: number | null): IMinFilter {
    return { operator, value, path: this.id.value, type: 'min' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.min(this)
  }

  get valueSchema() {
    const min = z.number().int().nonnegative()
    return this.required ? min : min.nullable()
  }
}
