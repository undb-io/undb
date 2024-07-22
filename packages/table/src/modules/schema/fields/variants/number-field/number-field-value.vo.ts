import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const numberFieldValueSchema = z.number().optional().nullable()
export type INumberFieldValue = z.infer<typeof numberFieldValueSchema>

export class NumberFieldValue extends FieldValueObject<INumberFieldValue> {
  constructor(value: INumberFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
