import { getMimeType } from './attachment-field-value.util.js'
import type { IAttachmentFieldValue } from './attachment-field.type.js'
import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'

export class AttachmentFieldValue extends FieldValueBase<IAttachmentFieldValue> {
  constructor(value: IAttachmentFieldValue) {
    super(value)
  }

  unpack() {
    return this.props
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.attachment(this)
  }

  public hasFileType(type: string): boolean {
    return this.props.some((attachment) => getMimeType(attachment) === type)
  }
}
