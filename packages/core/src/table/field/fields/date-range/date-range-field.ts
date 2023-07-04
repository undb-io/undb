import { format } from 'date-fns'
import { isArray } from 'lodash-es'
import { z } from 'zod'
import type { IRecordDisplayValues, RecordValueJSON } from '../../../record/index.js'
import { AbstractDateField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { DateFormat } from '../../value-objects/date-format.vo.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { TimeFormat } from '../../value-objects/time-format.vo.js'
import { DateRangeFieldValue } from './date-range-field-value.js'
import type {
  DateRangeType,
  ICreateDateRangeFieldSchema,
  IDateRangeField,
  IDateRangeFieldQueryValue,
} from './date-range-field.type.js'
import type { IDateRangeFilter, IDateRangeFilterOperator } from './date-range.filter.js'

export class DateRangeField extends AbstractDateField<IDateRangeField> {
  duplicate(name: string): DateRangeField {
    return DateRangeField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
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

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    const value = valueJson[this.id.value]
    if (!isArray(value)) return null
    const [from, to] = value
    if (!from || !to) return null
    const fromString = format(new Date(from), this.formatString)
    const toString = format(new Date(to), this.formatString)
    return fromString + ' - ' + toString
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
