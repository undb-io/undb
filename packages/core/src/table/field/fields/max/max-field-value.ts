import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IMaxFieldValue } from './max-field.type.js'

export class MaxFieldValue extends FieldValueBase<IMaxFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
  constructor(value: IMaxFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.max(this)
  }
}
