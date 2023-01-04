import { ValueObject } from '@egodb/domain'
import { isBoolean, isNumber, isString } from '@fxts/core'
import { isDate } from 'date-fns'
import { None, Option, Some } from 'oxide.ts'
import type { FieldValue, ICreateFieldsSchema_internal, IFieldValue, UnpackedFieldValue } from '../../field'
import { DateRangeFieldValue } from '../../field/date-range-field-value'
import type { IDateRangeFieldValue } from '../../field/date-range-field.type'
import { SelectFieldValue } from '../../field/select-field-value'
import type { TableSchemaMap } from '../../value-objects'
import type { IQueryRecordValues } from '../record.type'

export class RecordValues extends ValueObject<Map<string, FieldValue>> {
  static fromArray(inputs: ICreateFieldsSchema_internal): RecordValues {
    const values = new Map(inputs.map((v) => [v.field.name.value, v.field.createValue(v.value as never)]))
    return new RecordValues(values)
  }

  static fromObject(schema: TableSchemaMap, inputs: IQueryRecordValues): RecordValues {
    const values = new Map(
      Object.entries(inputs).map(([fieldName, fieldValue]) => [
        fieldName,
        // TODO: handler missing field
        schema.get(fieldName)!.createValue(fieldValue as never),
      ]),
    )

    return new RecordValues(values)
  }

  static empty(): RecordValues {
    return new RecordValues(new Map())
  }

  public get value() {
    return this.props
  }

  setValue(fieldName: string, value: FieldValue) {
    this.value.set(fieldName, value)
  }

  toObject() {
    const obj: Record<string, IFieldValue> = {}
    for (const [key, value] of this.value) {
      obj[key] = value.unpack()
    }
    return obj
  }

  /**
   * get unpacked field value
   *
   * @param name - field name
   * @returns unpacked field value
   */
  private getUnpackedValue(name: string): Option<UnpackedFieldValue> {
    return Option.nonNull(this.value.get(name)).map((v) => v.unpack())
  }

  /**
   * get field string value by field name
   * - if field not exists returns option none
   * - if value is not stirng returns option none
   *
   * @param name - field name
   * @returns unpacked string value
   */
  getStringValue(name: string): Option<string> {
    return this.getUnpackedValue(name)
      .map((v) => (isString(v) ? Some(v) : None))
      .flatten()
  }

  getBoolValue(name: string): Option<boolean> {
    return this.getUnpackedValue(name)
      .map((v) => (isBoolean(v) ? Some(v) : None))
      .flatten()
  }

  /**
   * get field number value by field name
   * - if field not exists returns option none
   * - if value is not number returns option none
   *
   * @param name - field name
   * @returns unpacked number value
   */
  getNumberValue(name: string): Option<number> {
    return this.getUnpackedValue(name)
      .map((v) => (isNumber(v) ? Some(v) : None))
      .flatten()
  }

  getDateValue(name: string): Option<Date> {
    return this.getUnpackedValue(name)
      .map((v) => (isDate(v) ? Some(v as Date) : None))
      .flatten()
  }

  getDateRangeValue(name: string): Option<IDateRangeFieldValue> {
    return this.getUnpackedValue(name)
      .map((v) => (DateRangeFieldValue.isDateRange(v) ? Some(v) : None))
      .flatten()
  }

  getSelectValue(name: string): Option<SelectFieldValue> {
    const value = this.value.get(name)
    if (SelectFieldValue.isSelectFieldValue(value)) {
      return Some(value)
    }
    return None
  }
}
