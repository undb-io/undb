import { ValueObject } from "@undb/domain"
import { z } from "zod"

export const mutateNumberFieldValueSchema = z.union([
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

export type IMutateNumberFieldValueSchema = z.infer<typeof mutateNumberFieldValueSchema>

export class NumberFieldValue extends ValueObject<number> {
  constructor(value: number) {
    super({ value })
  }
}
