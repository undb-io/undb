import { andOptions } from '@undb/domain'
import type { Option } from 'oxide.ts'
import type { ZodTypeAny } from 'zod'
import { z } from 'zod'
import type { ICreatedAtFilter } from '../filter/created-at.filter.js'
import type { ICreatedAtFilterOperator } from '../filter/operators.js'
import type { TableCompositeSpecificaiton } from '../specifications/index.js'
import { CreatedAtFieldValue } from './created-at-field-value.js'
import type {
  CreatedAtFieldType,
  ICreateCreatedAtFieldInput,
  ICreatedAtFieldQueryValue,
  IUpdateCreatedAtFieldInput,
} from './created-at-field.type.js'
import { AbstractDateField } from './field.base.js'
import type { ICreatedAtField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { DateFormat } from './value-objects/date-format.vo.js'

export class CreatedAtField extends AbstractDateField<ICreatedAtField> {
  type: CreatedAtFieldType = 'created-at'

  override get json() {
    return {
      ...super.json,
      format: this.formatString,
    }
  }

  override get system() {
    return true
  }

  override get primitive() {
    return true
  }

  static default(name: string): CreatedAtField {
    return this.create({ name })
  }

  static create(input: Omit<ICreateCreatedAtFieldInput, 'type'>): CreatedAtField {
    return new CreatedAtField({
      ...super.createBase(input),
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  static unsafeCreate(input: ICreateCreatedAtFieldInput): CreatedAtField {
    return new CreatedAtField({
      ...super.unsafeCreateBase(input),
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  public override update(input: IUpdateCreatedAtFieldInput): Option<TableCompositeSpecificaiton> {
    return andOptions(this.updateBase(input), this.updateFormat(input.format))
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

  get valueSchema(): ZodTypeAny {
    return z.string()
  }
}
