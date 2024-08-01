import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const updatedByFieldValue = z.string()
export type IUpdatedByFieldValue = z.infer<typeof updatedByFieldValue>

export class UpdatedByFieldValue extends FieldValueObject<IUpdatedByFieldValue> {
  isEmpty(): boolean {
    return false
  }
  constructor(value: IUpdatedByFieldValue) {
    super({ value })
  }
}
