import { z } from 'zod'
import type { IUpdatedAtFilterOperator } from '../filter/operators.js'
import type { IUpdatedAtFilter } from '../filter/updated-at.filter.js'
import { BaseDateField } from './field.base.js'
import type { IUpdatedAtField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { UpdatedAtFieldValue } from './updated-at-field-value.js'
import type {
  ICreateUpdatedAtFieldInput,
  IUpdatedAtFieldQueryValue,
  UpdatedAtFieldType,
} from './updated-at-field.type.js'

export class UpdatedAtField extends BaseDateField<IUpdatedAtField> {
  type: UpdatedAtFieldType = 'updated-at'
  override get controlled() {
    return true
  }

  override get system() {
    return true
  }

  override get primitive() {
    return true
  }

  static default(): UpdatedAtField {
    return this.create({
      name: 'updatedAt',
    })
  }

  static create(input: Omit<ICreateUpdatedAtFieldInput, 'type'>): UpdatedAtField {
    return new UpdatedAtField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateUpdatedAtFieldInput): UpdatedAtField {
    return new UpdatedAtField(super.unsafeCreateBase(input))
  }

  createValue(value: IUpdatedAtFieldQueryValue): UpdatedAtFieldValue {
    return UpdatedAtFieldValue.fromQuery(value)
  }

  createFilter(operator: IUpdatedAtFilterOperator, value: string | null): IUpdatedAtFilter {
    return { operator, value, path: this.id.value, type: 'updated-at' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.updatedAt(this)
  }

  get valueSchema() {
    return z.string().datetime()
  }
}
