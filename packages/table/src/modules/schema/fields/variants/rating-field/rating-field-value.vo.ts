import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const ratingFieldValueSchema = z.number().optional().nullable()
export type IRatingFieldValue = z.infer<typeof ratingFieldValueSchema>

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

export class RatingFieldValue extends FieldValueObject<IRatingFieldValue> {
  constructor(value: IRatingFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
