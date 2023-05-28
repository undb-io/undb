import { andOptions } from '@undb/domain'
import { z } from 'zod'
import type { ICountFilter, ICountFilterOperator } from '../filter/count.filter.js'
import { CountFieldValue } from './count-field-value.js'
import type {
  CountType,
  ICreateCountFieldInput,
  ICreateCountFieldValue,
  IUpdateCountFieldInput,
} from './count-field.type.js'
import { AbstractLookupField, BaseField } from './field.base.js'
import type { Field, ICountField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { FieldId } from './value-objects/field-id.vo.js'

export class CountField extends AbstractLookupField<ICountField> {
  duplicate(name: string): Field {
    return CountField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }

  type: CountType = 'count'

  override get json() {
    return {
      ...super.json,
      referenceFieldId: this.referenceFieldId.value,
    }
  }

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateCountFieldInput, 'type'>): CountField {
    return new CountField({
      ...BaseField.createBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
    })
  }

  static unsafeCreate(input: ICreateCountFieldInput): CountField {
    return new CountField({
      ...BaseField.unsafeCreateBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
    })
  }

  public override update(input: IUpdateCountFieldInput) {
    return andOptions(this.updateBase(input), this.updateReferenceId(input.referenceFieldId))
  }

  createValue(value: ICreateCountFieldValue): CountFieldValue {
    return new CountFieldValue(value)
  }

  createFilter(operator: ICountFilterOperator, value: number | null): ICountFilter {
    return { operator, value, path: this.id.value, type: 'count' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.count(this)
  }

  get valueSchema() {
    const count = z.number().int().nonnegative()
    return this.required ? count : count.nullable()
  }
}
