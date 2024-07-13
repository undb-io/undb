import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const stringFieldValue = z.string().nullable().optional()
export type IStringFieldValue = z.infer<typeof stringFieldValue>

export const mutateStringFieldValueSchema = z.union([
  z.string().optional().nullable(),
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

export class StringFieldValue extends FieldValueObject<IStringFieldValue> {
  constructor(value: IStringFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === "" || this.props?.value === null || this.props?.value === undefined
  }
}
