import { z } from 'zod'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues } from '../../../record/record.type.js'
import { BaseField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { EmailFieldValue } from './email-field-value.js'
import type { EmailFieldType, ICreateEmailFieldInput, ICreateEmailFieldValue, IEmailField } from './email-field.type.js'
import type { IEmailFilter, IEmailFilterOperator } from './email.filter.js'

export class EmailField extends BaseField<IEmailField> {
  duplicate(name: string): EmailField {
    return EmailField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }
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

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    return valueJson[this.id.value] ?? null
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

  get valueSchema() {
    const email = z.string()
    return this.required ? email.email() : email.nullable()
  }
}
