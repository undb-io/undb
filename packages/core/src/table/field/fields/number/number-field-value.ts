import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { INumberFieldValue } from './number-field.type.js'

export class NumberFieldValue extends FieldValueBase<INumberFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
  constructor(value: INumberFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.number(this)
  }
}
