import type { IAttachmentFieldValue } from './attachment-field.type.js'
import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'

export class AttachmentFieldValue extends FieldValueBase<IAttachmentFieldValue> {
  constructor(value: IAttachmentFieldValue) {
    super(value)
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.attachment(this)
  }
}
