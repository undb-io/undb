import { ValueObject } from '@egodb/domain'
import type { ITextFieldValue } from './text-field.type'

export class TextFieldValue extends ValueObject<ITextFieldValue> {
  constructor(value: ITextFieldValue) {
    super({ value })
  }
}
