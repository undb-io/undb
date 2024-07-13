import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

const autoIncrementValue = z.number()

type IAutoIncrementValue = z.infer<typeof autoIncrementValue>

export class AutoIncrementFieldValue extends FieldValueObject<IAutoIncrementValue> {
  isEmpty(): boolean {
    return false
  }

  constructor(value: IAutoIncrementValue) {
    super({ value })
  }
}
