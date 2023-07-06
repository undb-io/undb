import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IBoolFieldValue } from './bool-field.type.js'

export class BoolFieldValue extends FieldValueBase<IBoolFieldValue> {
  constructor(value: IBoolFieldValue) {
    super({ value })
  }

  get json(): JsonValue {
    return this.props.value
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
