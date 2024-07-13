import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const updatedAtFieldValue = z.date()
export type IUpdatedAtFieldValue = z.infer<typeof updatedAtFieldValue>

export class UpdatedAtFieldValue extends FieldValueObject<IUpdatedAtFieldValue> {
  isEmpty(): boolean {
    return false
  }
  constructor(value: IUpdatedAtFieldValue) {
    super({ value })
  }
}
