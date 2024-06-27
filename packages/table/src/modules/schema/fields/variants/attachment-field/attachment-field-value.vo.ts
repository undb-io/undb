import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const attachmentFieldValueItem = z.object({
  url: z.string(),
  name: z.string(),
  id: z.string(),
  size: z.number(),
  type: z.string(),
})

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

export class AttachmentFieldValue extends ValueObject<IAttachmentFieldValue> {
  constructor(value: IAttachmentFieldValue) {
    super(value)
  }

  isEmpty() {
    return this.props === null || this.props === undefined || this.props.length === 0
  }
}
