import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { isEmpty } from "radash"
import { recordId } from "../../../../records/record/record-id.vo"

const referenceFieldValueItem = recordId

export const mutateReferenceFieldValueSchema = z.union([
  referenceFieldValueItem.array().optional().nullable(),
  z.object({
    type: z.literal("set"),
    value: referenceFieldValueItem.array().nullable(),
  }),
  z.object({
    type: z.literal("append"),
    value: referenceFieldValueItem.array().nullable().or(referenceFieldValueItem),
  }),
  z.object({
    type: z.literal("prepend"),
    value: referenceFieldValueItem.array().nullable().or(referenceFieldValueItem),
  }),
])

export type IMutateReferenceFieldValueSchema = z.infer<typeof mutateReferenceFieldValueSchema>

export class ReferenceFieldValue extends ValueObject<string[]> {
  constructor(value: string[]) {
    super(value)
  }

  isEmpty() {
    return isEmpty(this.props)
  }
}
