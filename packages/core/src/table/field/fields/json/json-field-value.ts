import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IJsonFieldValue } from './json-field.type.js'

export class JsonFieldValue extends FieldValueBase<IJsonFieldValue> {
  constructor(value: IJsonFieldValue) {
    super(typeof value === 'object' && value !== null ? value : { value })
  }
  get json(): JsonValue {
    return this.props as JsonValue
  }

  get value() {
    return this.props
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.json(this)
  }
}
