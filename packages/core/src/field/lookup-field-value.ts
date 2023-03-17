import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'
import type { ILookupFieldValue } from './lookup-field.type.js'

export class LookupFieldValue extends FieldValueBase<ILookupFieldValue> {
  constructor(value: ILookupFieldValue) {
    super(value ? value : { value: null })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.lookup(this)
  }
}
