import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IEmailFieldValue } from './email-field.type.js'

export class EmailFieldValue extends FieldValueBase<IEmailFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
  constructor(value: IEmailFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.email(this)
  }
}
