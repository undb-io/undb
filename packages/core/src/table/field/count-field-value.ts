import type { ICountFieldValue } from './count-field.type.js'
import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'

export class CountFieldValue extends FieldValueBase<ICountFieldValue> {
  constructor(value: ICountFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.count(this)
  }
}
