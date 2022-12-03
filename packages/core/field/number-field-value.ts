import { ValueObject } from '@egodb/domain/dist'
import type { INumberFieldValue } from './number-field.type'

export class NumberFieldValue extends ValueObject<INumberFieldValue> {
  constructor(value: number) {
    super({ value })
  }
}
