import type { IAutoIncrementFieldValue } from './auto-increment-field.type'
import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'

export class AutoIncrementFieldValue extends FieldValueBase<IAutoIncrementFieldValue> {
  constructor(value: IAutoIncrementFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.autoIncrement(this)
  }
}
