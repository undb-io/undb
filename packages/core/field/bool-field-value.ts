import { ValueObject } from '@egodb/domain'
import type { IBoolFieldValue } from './bool-field.type'

export class BoolFieldValue extends ValueObject<IBoolFieldValue> {
  constructor(value: IBoolFieldValue) {
    super({ value })
  }
}
