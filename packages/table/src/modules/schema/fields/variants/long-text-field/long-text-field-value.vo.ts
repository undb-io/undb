import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const longTextFieldValue = z.string().optional().nullable()
export type ILongTextFieldValue = z.infer<typeof longTextFieldValue>

export class LongTextFieldValue extends FieldValueObject<ILongTextFieldValue> {
  constructor(value: ILongTextFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
