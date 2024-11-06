import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const checkboxFieldValue = z.boolean().nullable()

type ICheckboxFieldValue = z.infer<typeof checkboxFieldValue>

export class CheckboxFieldValue extends FieldValueObject<ICheckboxFieldValue> {
  constructor(value: ICheckboxFieldValue) {
    super({ value })
  }

  isEmpty() {
    return this.value === null || this.value === undefined
  }
}
