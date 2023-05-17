import { z } from 'zod'
import type { IIdFilter } from '../filter/id.filter.js'
import type { IIdFilterOperator } from '../filter/operators.js'
import { BaseField } from './field.base.js'
import type { IIdField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { IdFieldValue } from './id-field-value.js'
import type { ICreateIdFieldInput, ICreateIdFieldValue, IdFieldType } from './id-field.type.js'

export class IdField extends BaseField<IIdField> {
  type: IdFieldType = 'id'

  override get system() {
    return true
  }

  static default(): IdField {
    return this.create({ name: 'id' })
  }

  static create(input: Omit<ICreateIdFieldInput, 'type'>): IdField {
    return new IdField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateIdFieldInput): IdField {
    return new IdField(super.unsafeCreateBase(input))
  }

  createValue(value: ICreateIdFieldValue): IdFieldValue {
    return new IdFieldValue(value)
  }

  createFilter(operator: IIdFilterOperator, value: string): IIdFilter {
    return { operator, value, path: this.id.value, type: 'id' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.id(this)
  }

  get valueSchema() {
    return z.string()
  }
}
