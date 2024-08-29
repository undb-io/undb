import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const buttonFieldValue = z.null()
export type IButtonFieldValue = z.infer<typeof buttonFieldValue>

export class ButtonFieldValue extends FieldValueObject<IButtonFieldValue> {
  constructor(value: IButtonFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
