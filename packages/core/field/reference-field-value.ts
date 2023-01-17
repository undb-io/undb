import { ValueObject } from '@egodb/domain'
import type { IReferenceFieldValue } from './reference-field.type'

export class ReferenceFieldValue extends ValueObject<IReferenceFieldValue> {
  constructor(value: IReferenceFieldValue) {
    super({ value })
  }
}
