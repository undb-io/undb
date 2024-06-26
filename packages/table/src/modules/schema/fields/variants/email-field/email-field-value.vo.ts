import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const mutateEmailFieldValueSchema = z.union([
  z.number().optional(),
  z.object({
    type: z.literal("set"),
    value: z.number(),
  }),
])

export type IMutateEmailFieldValueSchema = z.infer<typeof mutateEmailFieldValueSchema>

export class EmailFieldValue extends ValueObject<string> {
  constructor(value: string) {
    super({ value })
  }

  isEmpty() {
    return this.props.value === null || this.props.value === undefined
  }
}
