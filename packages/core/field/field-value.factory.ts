import { isNumber, isString } from '@fxts/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
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

    return None
  }
}
