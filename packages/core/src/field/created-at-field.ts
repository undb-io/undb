import type { ICreatedAtFilter } from '../filter/created-at.filter.js'
import type { ICreatedAtFilterOperator } from '../filter/operators.js'
import { CreatedAtFieldValue } from './created-at-field-value.js'
import type {
  CreatedAtFieldType,
  ICreateCreatedAtFieldInput,
  ICreatedAtFieldQueryValue,
} from './created-at-field.type.js'
import { BaseDateField } from './field.base.js'
import type { ICreatedAtField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'

export class CreatedAtField extends BaseDateField<ICreatedAtField> {
  type: CreatedAtFieldType = 'created-at'
  override get controlled() {
    return true
  }

  override get system() {
    return true
  }

  override get primitive() {
    return true
  }

  static default(): CreatedAtField {
    return this.create({ name: 'createdAt' })
  }

  static create(input: Omit<ICreateCreatedAtFieldInput, 'type'>): CreatedAtField {
    return new CreatedAtField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateCreatedAtFieldInput): CreatedAtField {
    return new CreatedAtField(super.unsafeCreateBase(input))
  }

  createValue(value: ICreatedAtFieldQueryValue): CreatedAtFieldValue {
    return CreatedAtFieldValue.fromQuery(value)
  }

  createFilter(operator: ICreatedAtFilterOperator, value: string | null): ICreatedAtFilter {
    return { operator, value, path: this.id.value, type: 'created-at' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.createdAt(this)
  }
}
