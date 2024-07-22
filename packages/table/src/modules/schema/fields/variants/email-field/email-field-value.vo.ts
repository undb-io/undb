import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const emailFieldValue = z.string().email().optional().nullable()
export type IEmailFieldValue = z.infer<typeof emailFieldValue>

export class EmailFieldValue extends FieldValueObject<IEmailFieldValue> {
  constructor(value: IEmailFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
