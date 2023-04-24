import { z } from 'zod'
import type { IBoolFilter } from '../filter/bool.filter.js'
import type { IBoolFilterOperator } from '../filter/operators.js'
import { BoolFieldValue } from './bool-field-value.js'
import type { BoolFieldType, ICreateBoolFieldInput, ICreateBoolFieldValue } from './bool-field.type.js'
import { BaseField } from './field.base.js'
import type { IBoolField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'

export class BoolField extends BaseField<IBoolField> {
  type: BoolFieldType = 'bool'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateBoolFieldInput, 'type'>): BoolField {
    return new BoolField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateBoolFieldInput): BoolField {
    return new BoolField(super.unsafeCreateBase(input))
  }

  createValue(value: ICreateBoolFieldValue): BoolFieldValue {
    return new BoolFieldValue(value)
  }

  createFilter(operator: IBoolFilterOperator, value: boolean | null): IBoolFilter {
    return { operator, value, path: this.id.value, type: 'bool' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.bool(this)
  }

  get valueSchema() {
    const bool = z.boolean().default(false)

    return this.required ? bool : bool.nullable()
  }
}
