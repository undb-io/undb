import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const mutateStringFieldValueSchema = z.union([
  z.string().optional(),
  z.object({
    type: z.literal("set"),
    value: z.string(),
  }),
  z.object({
    type: z.literal("append"),
    value: z.string().min(1),
  }),
  z.object({
    type: z.literal("prepend"),
    value: z.string().min(1),
  }),
])

export type IMutateStringFieldValueSchema = z.infer<typeof mutateStringFieldValueSchema>

export class StringFieldValue extends ValueObject<string> {
  constructor(value: string) {
    super({ value })
  }

  isEmpty() {
    return this.props.value === "" || this.props.value === null || this.props.value === undefined
  }
}
