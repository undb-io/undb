import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const emailFieldValue = z.string().email().optional().nullable()
export type IEmailFieldValue = z.infer<typeof emailFieldValue>

export const mutateEmailFieldValueSchema = z.union([
  emailFieldValue,
  z.object({
    type: z.literal("set"),
    value: emailFieldValue.unwrap().unwrap(),
  }),
])

export type IMutateEmailFieldValueSchema = z.infer<typeof mutateEmailFieldValueSchema>

export class EmailFieldValue extends FieldValueObject<IEmailFieldValue> {
  constructor(value: IEmailFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
