import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'
import type { IReferenceFieldValue } from './reference-field.type.js'

export class ReferenceFieldValue extends FieldValueBase<IReferenceFieldValue> {
  constructor(value: IReferenceFieldValue) {
    super(value === null ? { value } : value)
  }

  unpack(): string[] | null {
    return Array.isArray(this.props) ? this.props : null
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.reference(this)
  }
}
