import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IMinFieldValue } from './min-field.type.js'

export class MinFieldValue extends FieldValueBase<IMinFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
  constructor(value: IMinFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.min(this)
  }
}
