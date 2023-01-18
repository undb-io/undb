import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'
import type { IStringFieldValue } from './string-field.type'

export class StringFieldValue extends FieldValueBase<IStringFieldValue> {
  constructor(value: IStringFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.string(this)
  }
}
