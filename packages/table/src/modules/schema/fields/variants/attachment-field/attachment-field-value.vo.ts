import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const attachmentFieldValueItem = z.object({
  url: z.string(),
  name: z.string(),
  id: z.string(),
  size: z.number(),
  type: z.string(),
})

export type IAttachmentFieldValueItem = z.infer<typeof attachmentFieldValueItem>

export const attachmentFieldValue = attachmentFieldValueItem.array()

export type IAttachmentFieldValue = z.infer<typeof attachmentFieldValue>

export const mutateAttachmentFieldValueSchema = z.union([
  attachmentFieldValue.optional().nullable(),
  z.object({
    type: z.literal("set"),
    value: attachmentFieldValue,
  }),
])

export type IMutateAttachmentFieldValueSchema = z.infer<typeof mutateAttachmentFieldValueSchema>

export class AttachmentFieldValue extends ValueObject<IAttachmentFieldValue | null> {
  constructor(value: IAttachmentFieldValue | null) {
    super(value === null ? { value } : value)
  }

  isEmpty() {
    return this.props === null || this.props === undefined || (Array.isArray(this.props) && this.props.length === 0)
  }
}

export function isImage(item: IAttachmentFieldValueItem) {
  return item.type.startsWith("image")
}
