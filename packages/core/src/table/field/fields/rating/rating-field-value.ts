import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IRatingFieldValue } from './rating-field.type.js'

export class RatingFieldValue extends FieldValueBase<IRatingFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
  constructor(value: IRatingFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.rating(this)
  }
}
