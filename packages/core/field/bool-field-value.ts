import type { IBoolFieldValue } from './bool-field.type'
import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'

export class BoolFieldValue extends FieldValueBase<IBoolFieldValue> {
  constructor(value: IBoolFieldValue) {
    super({ value })
  }

  static get T(): BoolFieldValue {
    return new this(true)
  }

  static get F(): BoolFieldValue {
    return new this(false)
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.bool(this)
  }
}
