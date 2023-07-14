import { Mixin } from 'ts-mixer'
import { z } from 'zod'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues } from '../../../record/record.type.js'
import { AbstractAggregateField, AbstractLookupField, BaseField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { MaxFieldValue } from './max-field-value.js'
import type { ICreateMaxFieldInput, ICreateMaxFieldValue, IMaxField, MaxType } from './max-field.type.js'
import type { IMaxFilter, IMaxFilterOperator } from './max.filter.js'

export class MaxField extends Mixin(AbstractAggregateField<IMaxField>, AbstractLookupField<IMaxField>) {
  duplicate(name: string): MaxField {
    return MaxField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }

  type: MaxType = 'max'
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

  static create(input: Omit<ICreateMaxFieldInput, 'type'>): MaxField {
    return new MaxField({
      ...BaseField.createBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
      aggregateFieldId: FieldId.fromString(input.aggregateFieldId),
    })
  }

  static unsafeCreate(input: ICreateMaxFieldInput): MaxField {
    return new MaxField({
      ...BaseField.unsafeCreateBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
      aggregateFieldId: FieldId.fromString(input.aggregateFieldId),
    })
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): number | null {
    return valueJson[this.id.value] ?? null
  }

  createValue(value: ICreateMaxFieldValue): MaxFieldValue {
    return new MaxFieldValue(value)
  }

  createFilter(operator: IMaxFilterOperator, value: number | null): IMaxFilter {
    return { operator, value, path: this.id.value, type: 'max' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.max(this)
  }

  get valueSchema() {
    const max = z.number().int().nonnegative()
    return this.required ? max : max.nullable()
  }
}
