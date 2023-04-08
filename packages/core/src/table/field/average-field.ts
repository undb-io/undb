import { andOptions } from '@egodb/domain'
import { Mixin } from 'ts-mixer'
import { z } from 'zod'
import type { IAverageFilter, IAverageFilterOperator } from '../filter/average.filter.js'
import { AverageFieldValue } from './average-field-value.js'
import type {
  AverageType,
  ICreateAverageFieldInput,
  ICreateAverageFieldValue,
  IUpdateAverageFieldInput,
} from './average-field.type.js'
import { AbstractAggregateField, AbstractLookupField, BaseField } from './field.base.js'
import type { IAverageField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { FieldId } from './value-objects/field-id.vo.js'

export class AverageField extends Mixin(AbstractAggregateField<IAverageField>, AbstractLookupField<IAverageField>) {
  type: AverageType = 'average'

  override get primitive() {
    return true
  }

  override get isNumeric() {
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

  public override update(input: IUpdateAverageFieldInput) {
    return andOptions(
      this.updateBase(input),
      this.updateReferenceId(input.referenceFieldId),
      this.updateAggregateFieldId(input.aggregateFieldId),
    )
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
