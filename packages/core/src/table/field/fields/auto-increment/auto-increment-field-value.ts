import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IAutoIncrementFieldValue } from './auto-increment-field.type.js'

export class AutoIncrementFieldValue extends FieldValueBase<IAutoIncrementFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }

  constructor(value: IAutoIncrementFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.autoIncrement(this)
  }
}
