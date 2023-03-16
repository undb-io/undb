import { z } from 'zod'
import type { ICountFilter, ICountFilterOperator } from '../filter/count.filter.js'
import { CountFieldValue } from './count-field-value.js'
import type { CountType, ICreateCountFieldInput, ICreateCountFieldValue } from './count-field.type.js'
import { BaseField } from './field.base.js'
import type { ICountField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { FieldId } from './value-objects/field-id.vo.js'

export class CountField extends BaseField<ICountField> {
  type: CountType = 'count'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateCountFieldInput, 'type'>): CountField {
    return new CountField({
      ...super.createBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
    })
  }

  static unsafeCreate(input: ICreateCountFieldInput): CountField {
    return new CountField({
      ...super.unsafeCreateBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
    })
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
