import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IReferenceFieldValue } from './reference-field.type.js'

export class ReferenceFieldValue extends FieldValueBase<IReferenceFieldValue> {
  get json(): JsonValue {
    return this.unpack()
  }

  constructor(value: IReferenceFieldValue) {
    super(value === null ? [] : value)
  }

  unpack(): string[] | null {
    return Array.isArray(this.props) ? this.props : []
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.reference(this)
  }
}
