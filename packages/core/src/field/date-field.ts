import { andOptions } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { z } from 'zod'
import type { IDateFilter } from '../filter/date.filter.js'
import type { IDateFilterOperator } from '../filter/index.js'
import { dateBuiltInOperators } from '../filter/operators.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import { DateFieldValue } from './date-field-value.js'
import type {
  DateType,
  ICreateDateFieldSchema,
  IDateFieldQueryValue,
  IUpdateDateFieldInput,
} from './date-field.type.js'
import { AbstractDateField } from './field.base.js'
import type { IDateField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { DateFormat } from './value-objects/date-format.vo.js'

export class DateField extends AbstractDateField<IDateField> {
  type: DateType = 'date'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateDateFieldSchema, 'type'>): DateField {
    return new DateField({
      ...super.createBase(input),
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  static unsafeCreate(input: ICreateDateFieldSchema): DateField {
    return new DateField({
      ...super.unsafeCreateBase(input),
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  public override update(input: IUpdateDateFieldInput): Option<TableCompositeSpecificaiton> {
    return andOptions(this.updateBase(input), this.updateFormat(input.format))
  }

  createValue(value: IDateFieldQueryValue): DateFieldValue {
    return DateFieldValue.fromNullableString(value)
  }

  createFilter(operator: IDateFilterOperator, value: string | null): IDateFilter {
    // built in operators ignore value
    let v = value
    if (dateBuiltInOperators.has(operator)) {
      v = null
    }
    return { operator, value: v, path: this.id.value, type: 'date' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.date(this)
  }

  get valueSchema() {
    const date = z.string().datetime()
    return this.required ? date : date.nullable()
  }
}
