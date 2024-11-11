import { z } from "@undb/zod"
import { isString } from "radash"
import { FieldValueObject } from "../../field-value"
import { dateFieldMacroSchema, isDateFieldMacro } from "./date-field-macro"

export const dateFieldValue = z.union([
  z.date(),
  z.string().datetime(),
  z.string().date(),
  dateFieldMacroSchema,
  z.null(),
  z.undefined(),
])
export type IDateFieldValue = z.infer<typeof dateFieldValue>

export class DateFieldValue extends FieldValueObject<IDateFieldValue> {
  constructor(value: IDateFieldValue) {
    super({
      value: isString(value) ? (isDateFieldMacro(value) ? value : new Date(value)) : (value ?? null),
    })
  }

  isEmpty() {
    return this.value === null || this.value === undefined
  }
}
