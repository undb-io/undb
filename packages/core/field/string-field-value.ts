import { ValueObject } from '@egodb/domain'
import type { IStringFieldValue } from './string-field.type'

export class StringFieldValue extends ValueObject<IStringFieldValue> {
  constructor(value: IStringFieldValue) {
    super({ value })
  }
}
