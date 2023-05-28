import type { Option } from 'oxide.ts'
import type { ZodTypeAny } from 'zod'
import { z } from 'zod'
import type { IUpdatedByFilterOperator } from '../filter/operators.js'
import type { IUpdatedByFilter } from '../filter/updated-by.filter.js'
import type { TableCompositeSpecificaiton } from '../specifications/index.js'
import { BaseField } from './field.base.js'
import { FieldCannotBeDuplicated } from './field.errors.js'
import type { IUpdatedByField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { UpdatedByFieldValue } from './updated-by-field-value.js'
import type {
  ICreateUpdatedByFieldInput,
  IUpdateUpdatedByFieldInput,
  IUpdatedByFieldQueryValue,
  UpdatedByFieldType,
} from './updated-by-field.type.js'

export class UpdatedByField extends BaseField<IUpdatedByField> {
  duplicate(name: string): UpdatedByField {
    throw new FieldCannotBeDuplicated()
  }
  type: UpdatedByFieldType = 'updated-by'

  override get system() {
    return true
  }

  override get primitive() {
    return true
  }

  static default(name: string): UpdatedByField {
    return this.create({ name })
  }

  static create(input: Omit<ICreateUpdatedByFieldInput, 'type'>): UpdatedByField {
    return new UpdatedByField({
      ...super.createBase(input),
    })
  }

  static unsafeCreate(input: ICreateUpdatedByFieldInput): UpdatedByField {
    return new UpdatedByField({
      ...super.unsafeCreateBase(input),
    })
  }

  public override update(input: IUpdateUpdatedByFieldInput): Option<TableCompositeSpecificaiton> {
    return this.updateBase(input)
  }

  createValue(value: IUpdatedByFieldQueryValue): UpdatedByFieldValue {
    return UpdatedByFieldValue.fromQuery(value)
  }

  createFilter(operator: IUpdatedByFilterOperator, value: string): IUpdatedByFilter {
    return { operator, value, path: this.id.value, type: 'updated-by' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.updatedBy(this)
  }

  get valueSchema(): ZodTypeAny {
    return z.any()
  }
}
