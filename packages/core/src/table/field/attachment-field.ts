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
import { FieldId } from './value-objects/field-id.vo.js'

export class AttachmentField extends BaseField<IAttachmentField> {
  duplicate(name: string): AttachmentField {
    return AttachmentField.create({
      ...super.json,
      id: FieldId.createId(),
      name,
    })
  }

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
        name: z.string(),
        size: z.number().nonnegative(),
        mimeType: z.string(),
        id: z.string(),
        token: z.string(),
        url: z.string(),
      })
      .strict()
      .array()
    return this.required ? attachment.nonempty() : attachment
  }
}
