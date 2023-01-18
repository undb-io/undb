import type { IBoolFieldValue } from './bool-field.type'
import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'

export class BoolFieldValue extends FieldValueBase<IBoolFieldValue> {
  constructor(value: IBoolFieldValue) {
    super({ value })
  }

  static T(): BoolFieldValue {
    return new this(true)
  }

  static F(): BoolFieldValue {
    return new this(false)
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.bool(this)
  }
}
