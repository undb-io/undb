import type { IAutoIncrementFieldValue } from './auto-increment-field.type.js'
import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'

export class AutoIncrementFieldValue extends FieldValueBase<IAutoIncrementFieldValue> {
  constructor(value: IAutoIncrementFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.autoIncrement(this)
  }
}
