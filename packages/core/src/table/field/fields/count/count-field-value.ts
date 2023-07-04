import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { ICountFieldValue } from './count-field.type.js'

export class CountFieldValue extends FieldValueBase<ICountFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
  constructor(value: ICountFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.count(this)
  }
}
