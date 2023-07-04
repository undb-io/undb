import { format } from 'date-fns'
import { z } from 'zod'
import type { IRecordDisplayValues } from '../../../record/index.js'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import { AbstractDateField } from '../../field.base.js'
import { INTERNAL_COLUMN_UPDATED_AT_NAME } from '../../field.constants.js'
import { FieldCannotBeDuplicated } from '../../field.errors.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { DateFormat } from '../../value-objects/date-format.vo.js'
import { TimeFormat } from '../../value-objects/time-format.vo.js'
import { UpdatedAtFieldValue } from './updated-at-field-value.js'
import type {
  ICreateUpdatedAtFieldInput,
  IUpdatedAtField,
  IUpdatedAtFieldQueryValue,
  UpdatedAtFieldType,
} from './updated-at-field.type.js'
import type { IUpdatedAtFilter, IUpdatedAtFilterOperator } from './updated-at.filter.js'

export class UpdatedAtField extends AbstractDateField<IUpdatedAtField> {
  duplicate(name: string): UpdatedAtField {
    throw new FieldCannotBeDuplicated()
  }
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

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    const value = valueJson[INTERNAL_COLUMN_UPDATED_AT_NAME]
    return value ? format(new Date(value), this.formatString) : null
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
