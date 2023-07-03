import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { ICurrencyFieldValue } from './currency-field.type.js'

export class CurrencyFieldValue extends FieldValueBase<ICurrencyFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
  constructor(value: ICurrencyFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.currency(this)
  }
}
