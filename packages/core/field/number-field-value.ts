import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'
import type { INumberFieldValue } from './number-field.type.js'

export class NumberFieldValue extends FieldValueBase<INumberFieldValue> {
  constructor(value: INumberFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.number(this)
  }
}
