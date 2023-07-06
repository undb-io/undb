import { Mixin } from 'ts-mixer'
import { z } from 'zod'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues } from '../../../record/record.type.js'
import { AbstractAggregateField, AbstractLookupField, BaseField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { AverageFieldValue } from './average-field-value.js'
import type {
  AverageType,
  IAverageField,
  ICreateAverageFieldInput,
  ICreateAverageFieldValue,
} from './average-field.type.js'
import type { IAverageFilter, IAverageFilterOperator } from './average.filter.js'

export class AverageField extends Mixin(AbstractAggregateField<IAverageField>, AbstractLookupField<IAverageField>) {
  type: AverageType = 'average'

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

  static create(input: Omit<ICreateAverageFieldInput, 'type'>): AverageField {
    return new AverageField({
      ...BaseField.createBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
      aggregateFieldId: FieldId.fromString(input.aggregateFieldId),
    })
  }

  static unsafeCreate(input: ICreateAverageFieldInput): AverageField {
    return new AverageField({
      ...BaseField.unsafeCreateBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
      aggregateFieldId: FieldId.fromString(input.aggregateFieldId),
    })
  }

  public getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): number | null {
    return valueJson[this.id.value] ?? null
  }

  public override duplicate(name: string): AverageField {
    return AverageField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }

  createValue(value: ICreateAverageFieldValue): AverageFieldValue {
    return new AverageFieldValue(value)
  }

  createFilter(operator: IAverageFilterOperator, value: number | null): IAverageFilter {
    return { operator, value, path: this.id.value, type: 'average' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.average(this)
  }

  get valueSchema() {
    const average = z.number().int().nonnegative()
    return this.required ? average : average.nullable()
  }
}
