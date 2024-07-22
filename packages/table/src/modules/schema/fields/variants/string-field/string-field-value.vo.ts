import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const stringFieldValue = z.string().nullable().optional()
export type IStringFieldValue = z.infer<typeof stringFieldValue>

export class StringFieldValue extends FieldValueObject<IStringFieldValue> {
  constructor(value: IStringFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === "" || this.props?.value === null || this.props?.value === undefined
  }
}
