import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const mutateRatingFieldValueSchema = z.union([
  z.number().optional(),
  z.object({
    type: z.literal("set"),
    value: z.number(),
  }),
  z.object({
    type: z.literal("inc"),
    value: z.number(),
  }),
  z.object({
    type: z.literal("dec"),
    value: z.number(),
  }),
])

export type IMutateRatingFieldValueSchema = z.infer<typeof mutateRatingFieldValueSchema>

export class RatingFieldValue extends ValueObject<number> {
  constructor(value: number) {
    super({ value })
  }

  isEmpty() {
    return this.props.value === null || this.props.value === undefined
  }
}
