import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const createdAtFieldValue = z.date()

export type ICreatedAtFieldValue = z.infer<typeof createdAtFieldValue>

export class CreatedAtFieldValue extends FieldValueObject<ICreatedAtFieldValue> {
  isEmpty(): boolean {
    return false
  }

  constructor(value: ICreatedAtFieldValue) {
    super({ value })
  }
}
