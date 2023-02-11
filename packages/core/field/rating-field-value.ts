import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'
import type { IRatingFieldValue } from './rating-field.type'

export class RatingFieldValue extends FieldValueBase<IRatingFieldValue> {
  constructor(value: IRatingFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.rating(this)
  }
}
