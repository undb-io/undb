import { Mixin } from 'ts-mixer'
import { z } from 'zod'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues } from '../../../record/record.type.js'
import { AbstractAggregateField, AbstractLookupField, BaseField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { MinFieldValue } from './min-field-value.js'
import type { ICreateMinFieldInput, ICreateMinFieldValue, IMinField, MinType } from './min-field.type.js'
import type { IMinFilter, IMinFilterOperator } from './min.filter.js'

export class MinField extends Mixin(AbstractAggregateField<IMinField>, AbstractLookupField<IMinField>) {
  duplicate(name: string): MinField {
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
      aggregateFieldId: this.aggregateFieldId.value,
    }
  }

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateMinFieldInput, 'type'>): MinField {
    return new MinField({
      ...BaseField.createBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
      aggregateFieldId: FieldId.fromString(input.aggregateFieldId),
    })
  }

  static unsafeCreate(input: ICreateMinFieldInput): MinField {
    return new MinField({
      ...BaseField.unsafeCreateBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
      aggregateFieldId: FieldId.fromString(input.aggregateFieldId),
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
