import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const numberFieldValueSchema = z.number().optional().nullable()
export type INumberFieldValue = z.infer<typeof numberFieldValueSchema>

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

export class NumberFieldValue extends FieldValueObject<INumberFieldValue> {
  constructor(value: INumberFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
