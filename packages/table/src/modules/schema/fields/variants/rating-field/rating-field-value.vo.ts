import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const ratingFieldValueSchema = z.number().optional().nullable()
export type IRatingFieldValue = z.infer<typeof ratingFieldValueSchema>

export class RatingFieldValue extends FieldValueObject<IRatingFieldValue> {
  constructor(value: IRatingFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
