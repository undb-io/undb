import type { Option } from 'oxide.ts'
import type { ZodTypeAny } from 'zod'
import { z } from 'zod'
import type { ICreatedByFilter } from '../filter/created-by.filter.js'
import type { ICreatedByFilterOperator } from '../filter/operators.js'
import type { TableCompositeSpecificaiton } from '../specifications/index.js'
import { CreatedByFieldValue } from './created-by-field-value.js'
import type {
  CreatedByFieldType,
  ICreateCreatedByFieldInput,
  ICreatedByFieldQueryValue,
  IUpdateCreatedByFieldInput,
} from './created-by-field.type.js'
import { BaseField } from './field.base.js'
import type { ICreatedByField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'

export class CreatedByField extends BaseField<ICreatedByField> {
  type: CreatedByFieldType = 'created-by'

  override get system() {
    return true
  }

  override get primitive() {
    return true
  }

  static default(): CreatedByField {
    return this.create({ name: 'createdBy' })
  }

  static create(input: Omit<ICreateCreatedByFieldInput, 'type'>): CreatedByField {
    return new CreatedByField({
      ...super.createBase(input),
    })
  }

  static unsafeCreate(input: ICreateCreatedByFieldInput): CreatedByField {
    return new CreatedByField({
      ...super.unsafeCreateBase(input),
    })
  }

  public override update(input: IUpdateCreatedByFieldInput): Option<TableCompositeSpecificaiton> {
    return this.updateBase(input)
  }

  createValue(value: ICreatedByFieldQueryValue): CreatedByFieldValue {
    return CreatedByFieldValue.fromQuery(value)
  }

  createFilter(operator: ICreatedByFilterOperator, value: string): ICreatedByFilter {
    return { operator, value, path: this.id.value, type: 'created-by' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.createdBy(this)
  }

  get valueSchema(): ZodTypeAny {
    return z.string().datetime()
  }
}
