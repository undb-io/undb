import type { IDateRangeFilterOperator } from '../filter'
import type { IDateRangeFilter } from '../filter/date-range.filter'
import { DateRangeFieldValue } from './date-range-field-value'
import type {
  DateRangeType,
  ICreateDateRangeFieldSchema,
  ICreateDateRangeFieldValue,
  IDateRangeFieldValue,
} from './date-range-field.type'
import { BaseField } from './field.base'
import type { IDateRangeField } from './field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class DateRangeField extends BaseField<IDateRangeField> {
  get type(): DateRangeType {
    return 'date-range'
  }

  static create(input: ICreateDateRangeFieldSchema): DateRangeField {
    return new DateRangeField({
      id: FieldId.from(input.id),
      name: FieldName.create(input.name),
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateDateRangeFieldSchema): DateRangeField {
    return new DateRangeField({
      id: FieldId.from(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }

  createValue(value: ICreateDateRangeFieldValue): DateRangeFieldValue {
    return new DateRangeFieldValue(value)
  }

  createFilter(operator: IDateRangeFilterOperator, value: IDateRangeFieldValue | null): IDateRangeFilter {
    return { operator, value: value, path: this.name.value, type: 'date-range' }
  }
}
