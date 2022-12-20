import { isNumber, isString } from '@fxts/core'
import { isDate } from 'date-fns'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { isOption } from '../option/option'
import { DateFieldValue } from './date-field-value'
import type { FieldValue, IFieldValue } from './field.type'
import { NumberFieldValue } from './number-field-value'
import { SelectFieldValue } from './select-field-value'
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

    if (isOption(value)) {
      return Some(new SelectFieldValue({ name: value.name }))
    }

    return None
  }
}
