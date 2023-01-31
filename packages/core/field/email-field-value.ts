import type { IEmailFieldValue } from './email-field.type'
import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'

export class EmailFieldValue extends FieldValueBase<IEmailFieldValue> {
  constructor(value: IEmailFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.email(this)
  }
}
