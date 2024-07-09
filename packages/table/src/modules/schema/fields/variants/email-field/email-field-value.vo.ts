import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const mutateEmailFieldValueSchema = z.union([
  z.string().email().optional().nullable(),
  z.object({
    type: z.literal("set"),
    value: z.string().email(),
  }),
])

export type IMutateEmailFieldValueSchema = z.infer<typeof mutateEmailFieldValueSchema>

export class EmailFieldValue extends ValueObject<string | null> {
  constructor(value: string | null) {
    super({ value })
  }

  isEmpty() {
    return this.props.value === null || this.props.value === undefined
  }
}
