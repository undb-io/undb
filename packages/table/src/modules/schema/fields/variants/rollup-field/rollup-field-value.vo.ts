import { z } from "@undb/zod"
import { isEmpty } from "radash"
import { FieldValueObject } from "../../field-value"

export const rollupFieldValue = z.union([z.number(), z.date(), z.null(), z.undefined()])
export type IRollupFieldValue = z.infer<typeof rollupFieldValue>

export class RollupFieldValue extends FieldValueObject<IRollupFieldValue> {
  constructor(value: IRollupFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return isEmpty(this.props)
  }
}
