import { andOptions } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { z } from 'zod'
import type { IUpdatedAtFilterOperator } from '../filter/operators.js'
import type { IUpdatedAtFilter } from '../filter/updated-at.filter.js'
import type { TableCompositeSpecificaiton } from '../specifications/index.js'
import { AbstractDateField } from './field.base.js'
import type { IUpdatedAtField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { UpdatedAtFieldValue } from './updated-at-field-value.js'
import type {
  ICreateUpdatedAtFieldInput,
  IUpdatedAtFieldQueryValue,
  IUpdateUpdatedAtFieldInput,
  UpdatedAtFieldType,
} from './updated-at-field.type.js'
import { DateFormat } from './value-objects/date-format.vo.js'
import { TimeFormat } from './value-objects/time-format.vo.js'

export class UpdatedAtField extends AbstractDateField<IUpdatedAtField> {
  type: UpdatedAtFieldType = 'updated-at'

  override get json() {
    return {
      ...super.json,
      format: this.formatString,
      timeFormat: this.timeFormatString,
    }
  }

  override get system() {
    return true
  }

  override get primitive() {
    return true
  }

  static default(name: string): UpdatedAtField {
    return this.create({ name })
  }

  static create(input: Omit<ICreateUpdatedAtFieldInput, 'type'>): UpdatedAtField {
    return new UpdatedAtField({
      ...super.createBase(input),
      timeFormat: input.timeFormat ? TimeFormat.from(input.timeFormat) : undefined,
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  static unsafeCreate(input: ICreateUpdatedAtFieldInput): UpdatedAtField {
    return new UpdatedAtField({
      ...super.unsafeCreateBase(input),
      timeFormat: input.timeFormat ? TimeFormat.from(input.timeFormat) : undefined,
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  public override update(input: IUpdateUpdatedAtFieldInput): Option<TableCompositeSpecificaiton> {
    return andOptions(this.updateBase(input), this.updateFormat(input.format), this.updateTimeFormat(input.timeFormat))
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
    return z.string()
  }
}
