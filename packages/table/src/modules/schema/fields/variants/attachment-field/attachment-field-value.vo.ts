import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const attachmentFieldValue = z.object({
  url: z.string(),
})

export type IAttachmentFieldValue = z.infer<typeof attachmentFieldValue>

export const mutateAttachmentFieldValueSchema = z.union([
  attachmentFieldValue.array().optional().nullable(),
  z.object({
    type: z.literal("set"),
    value: attachmentFieldValue.array(),
  }),
])

export type IMutateAttachmentFieldValueSchema = z.infer<typeof mutateAttachmentFieldValueSchema>

export class AttachmentFieldValue extends ValueObject<IAttachmentFieldValue[]> {
  constructor(value: IAttachmentFieldValue[]) {
    super(value)
  }

  isEmpty() {
    return this.props === null || this.props === undefined || this.props.length === 0
  }
}
