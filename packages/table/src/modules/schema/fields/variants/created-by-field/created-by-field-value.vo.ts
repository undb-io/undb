import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const createdByFieldValue = z.string()
export type ICreatedByFieldValue = z.infer<typeof createdByFieldValue>

export class CreatedByFieldValue extends FieldValueObject<ICreatedByFieldValue> {
  isEmpty(): boolean {
    return false
  }
  constructor(value: ICreatedByFieldValue) {
    super({ value })
  }
}
