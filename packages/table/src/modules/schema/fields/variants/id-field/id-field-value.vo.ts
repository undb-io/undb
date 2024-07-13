import type { z } from "@undb/zod"
import { recordId } from "../../../../records/record/record-id.vo"
import { FieldValueObject } from "../../field-value"

export const idFieldValue = recordId
export type IIdFieldValue = z.infer<typeof idFieldValue>

export class IdFieldValue extends FieldValueObject<IIdFieldValue> {
  isEmpty(): boolean {
    return false
  }
  constructor(value: IIdFieldValue) {
    super({ value })
  }
}
