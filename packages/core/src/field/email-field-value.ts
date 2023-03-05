import type { IEmailFieldValue } from './email-field.type.js'
import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'

export class EmailFieldValue extends FieldValueBase<IEmailFieldValue> {
  constructor(value: IEmailFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.email(this)
  }
}
