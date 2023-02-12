import type { IEmailFilter, IEmailFilterOperator } from '../filter/email.filter.js'
import { EmailFieldValue } from './email-field-value.js'
import type { EmailFieldType, ICreateEmailFieldInput, ICreateEmailFieldValue } from './email-field.type.js'
import { BaseField } from './field.base.js'
import type { IEmailField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class EmailField extends BaseField<IEmailField> {
  type: EmailFieldType = 'email'

  static create(input: Omit<ICreateEmailFieldInput, 'type'>): EmailField {
    const fieldName = FieldName.create(input.name)

    return new EmailField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateEmailFieldInput): EmailField {
    return new EmailField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
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
