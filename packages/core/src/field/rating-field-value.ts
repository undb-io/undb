import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'
import type { IRatingFieldValue } from './rating-field.type.js'

export class RatingFieldValue extends FieldValueBase<IRatingFieldValue> {
  constructor(value: IRatingFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.rating(this)
  }
}
