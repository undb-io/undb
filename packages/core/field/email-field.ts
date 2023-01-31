import type { IEmailFilter, IEmailFilterOperator } from '../filter/email.filter'
import { EmailFieldValue } from './email-field-value'
import type { EmailFieldType, ICreateEmailFieldInput, ICreateEmailFieldValue } from './email-field.type'
import { BaseField } from './field.base'
import type { IEmailField } from './field.type'
import type { IFieldVisitor } from './field.visitor'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class EmailField extends BaseField<IEmailField> {
  type: EmailFieldType = 'email'

  static create(input: ICreateEmailFieldInput): EmailField {
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
