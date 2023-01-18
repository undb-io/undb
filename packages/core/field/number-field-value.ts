import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'
import type { INumberFieldValue } from './number-field.type'

export class NumberFieldValue extends FieldValueBase<INumberFieldValue> {
  constructor(value: INumberFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.number(this)
  }
}
