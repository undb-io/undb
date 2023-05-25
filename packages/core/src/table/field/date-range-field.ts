import { andOptions } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { z } from 'zod'
import type { IDateRangeFilter } from '../filter/date-range.filter.js'
import type { IDateRangeFilterOperator } from '../filter/index.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import { DateRangeFieldValue } from './date-range-field-value.js'
import type {
  DateRangeType,
  ICreateDateRangeFieldSchema,
  IDateRangeFieldQueryValue,
  IUpdateDateRangeFieldInput,
} from './date-range-field.type.js'
import { AbstractDateField } from './field.base.js'
import type { IDateRangeField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { DateFormat } from './value-objects/date-format.vo.js'
import { FieldId } from './value-objects/field-id.vo.js'
import { TimeFormat } from './value-objects/time-format.vo.js'

export class DateRangeField extends AbstractDateField<IDateRangeField> {
  duplicate(name: string): DateRangeField {
    return DateRangeField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
    })
  }

  type: DateRangeType = 'date-range'

  override get json() {
    return {
      ...super.json,
      format: this.formatString,
      timeFormat: this.timeFormatString,
    }
  }

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateDateRangeFieldSchema, 'type'>): DateRangeField {
    return new DateRangeField({
      ...super.createBase(input),
      timeFormat: input.timeFormat ? TimeFormat.from(input.timeFormat) : undefined,
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  static unsafeCreate(input: ICreateDateRangeFieldSchema): DateRangeField {
    return new DateRangeField({
      ...super.unsafeCreateBase(input),
      timeFormat: input.timeFormat ? TimeFormat.from(input.timeFormat) : undefined,
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  public override update(input: IUpdateDateRangeFieldInput): Option<TableCompositeSpecificaiton> {
    return andOptions(this.updateBase(input), this.updateFormat(input.format), this.updateTimeFormat(input.timeFormat))
  }

  createValue(value: IDateRangeFieldQueryValue): DateRangeFieldValue {
    return DateRangeFieldValue.fromQuery(value)
  }

  createFilter(operator: IDateRangeFilterOperator, value: [string | null, string | null] | null): IDateRangeFilter {
    return {
      operator,
      value: value ?? [null, null],
      path: this.id.value,
      type: 'date-range',
    }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.dateRange(this)
  }

  get valueSchema() {
    const dateRange = z.tuple([z.string().nullable(), z.string().nullable()])

    return this.required ? dateRange : dateRange.nullable()
  }
}
