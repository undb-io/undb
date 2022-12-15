import { isNumber, isString } from '@fxts/core'
import { isDate } from 'date-fns'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { DateFieldValue } from './date-field-value'
import type { FieldValue, IFieldValue } from './field.type'
import { NumberFieldValue } from './number-field-value'
import { TextFieldValue } from './text-field-value'

export class FieldValueFactory {
  static from(value: IFieldValue): Option<FieldValue> {
    if (isString(value)) {
      return Some(new TextFieldValue(value))
    }

    if (isNumber(value)) {
      return Some(new NumberFieldValue(value))
    }

    if (isDate(value)) {
      return Some(new DateFieldValue(value as Date | null))
    }

    return None
  }
}
