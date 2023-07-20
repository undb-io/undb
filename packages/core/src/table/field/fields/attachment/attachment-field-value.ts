import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import { getExtension, getMimeType, isImage } from './attachment-field-value.util.js'
import type { IAttachmentFieldValue } from './attachment-field.type.js'

export class AttachmentFieldValue extends FieldValueBase<IAttachmentFieldValue> {
  get json(): JsonValue {
    return this.props
  }
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

  public isEmpty(): boolean {
    return !this.props.length
  }

  getImages() {
    return this.props.filter(isImage)
  }

  public hasExtension(extension: string[]): boolean {
    return this.props.some((attachment) => {
      const ext = getExtension(attachment.mimeType)
      return !!ext && extension.includes(ext)
    })
  }
}
