import { format } from 'date-fns'
import { z } from 'zod'
import type { IRecordDisplayValues } from '../../../record/index.js'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import { AbstractDateField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { DateFormat } from '../../value-objects/date-format.vo.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { TimeFormat } from '../../value-objects/time-format.vo.js'
import { DateFieldValue } from './date-field-value.js'
import type { DateType, ICreateDateFieldSchema, IDateField, IDateFieldQueryValue } from './date-field.type.js'
import { dateBuiltInOperators, type IDateFilter, type IDateFilterOperator } from './date.filter.js'

export class DateField extends AbstractDateField<IDateField> {
  duplicate(name: string): DateField {
    return DateField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }
  type: DateType = 'date'

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    const value = valueJson[this.id.value]
    return value ? format(new Date(value), this.formatString) : null
  }

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

  static create(input: Omit<ICreateDateFieldSchema, 'type'>): DateField {
    return new DateField({
      ...super.createBase(input),
      timeFormat: input.timeFormat ? TimeFormat.from(input.timeFormat) : undefined,
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
  }

  static unsafeCreate(input: ICreateDateFieldSchema): DateField {
    return new DateField({
      ...super.unsafeCreateBase(input),
      timeFormat: input.timeFormat ? TimeFormat.from(input.timeFormat) : undefined,
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    })
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
    const date = z.string()
    return this.required ? date : date.nullable()
  }
}
