import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'
import type { ISumFieldValue } from './sum-field.type.js'

export class SumFieldValue extends FieldValueBase<ISumFieldValue> {
  constructor(value: ISumFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.sum(this)
  }
}
