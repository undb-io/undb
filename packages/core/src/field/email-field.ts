import type { IEmailFilter, IEmailFilterOperator } from '../filter/email.filter.js'
import { EmailFieldValue } from './email-field-value.js'
import type { EmailFieldType, ICreateEmailFieldInput, ICreateEmailFieldValue } from './email-field.type.js'
import { BaseField } from './field.base.js'
import type { IEmailField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'

export class EmailField extends BaseField<IEmailField> {
  type: EmailFieldType = 'email'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateEmailFieldInput, 'type'>): EmailField {
    return new EmailField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateEmailFieldInput): EmailField {
    return new EmailField(super.unsafeCreateBase(input))
  }

  createValue(value: ICreateEmailFieldValue): EmailFieldValue {
    return new EmailFieldValue(value)
  }

  createFilter(operator: IEmailFilterOperator, value: string | null): IEmailFilter {
    return { operator, value, path: this.id.value, type: 'email' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.email(this)
  }
}
