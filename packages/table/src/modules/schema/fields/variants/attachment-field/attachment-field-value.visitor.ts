import type { AttachmentEmpty, AttachmentEqual } from "./attachment-field.specification"

export interface IAttachmentFieldValueVisitor {
  attachmentEqual(s: AttachmentEqual): void
  attachmentEmpty(s: AttachmentEmpty): void
}
