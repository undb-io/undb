import { z } from 'zod'
import type { IAttachmentFilter, IAttachmentFilterOperator } from '../filter/attachment.filter.js'
import { AttachmentFieldValue } from './attachment-field-value.js'
import type {
  AttachmentFieldType,
  ICreateAttachmentFieldInput,
  ICreateAttachmentFieldValue,
} from './attachment-field.type.js'
import { BaseField } from './field.base.js'
import type { IAttachmentField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'

export class AttachmentField extends BaseField<IAttachmentField> {
  type: AttachmentFieldType = 'attachment'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateAttachmentFieldInput, 'type'>): AttachmentField {
    return new AttachmentField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateAttachmentFieldInput): AttachmentField {
    return new AttachmentField(super.unsafeCreateBase(input))
  }

  createValue(value: ICreateAttachmentFieldValue): AttachmentFieldValue {
    return new AttachmentFieldValue(value)
  }

  createFilter(operator: IAttachmentFilterOperator, value: string | null): IAttachmentFilter {
    return { operator, value, path: this.id.value, type: 'attachment' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.attachment(this)
  }

  get valueSchema() {
    const attachment = z
      .object({
        size: z.number().nonnegative(),
        mimeType: z.string(),
        id: z.string(),
        token: z.string(),
      })
      .strict()
      .array()
    return this.required ? attachment.nonempty() : attachment
  }
}
