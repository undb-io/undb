import { ValueObject } from '@egodb/domain'
import type { IReferenceFieldValue } from './reference-field.type'

export class ReferenceFieldValue extends ValueObject<IReferenceFieldValue> {
  constructor(value: IReferenceFieldValue) {
    super(value === null ? { value } : value)
  }

  unpack(): string[] | null {
    return Array.isArray(this.props) ? this.props : null
  }
}
