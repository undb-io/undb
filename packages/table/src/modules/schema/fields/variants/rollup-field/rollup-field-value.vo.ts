import { z } from "@undb/zod"
import { isEmpty } from "radash"
import { FieldValueObject } from "../../field-value"

export const rollupFieldValue = z.union([
  z.number(),
  z.date(),
  z.null(),
  z.undefined(),
  z.string().or(z.null()).array(),
])
export type IRollupFieldValue = z.infer<typeof rollupFieldValue>

export class RollupFieldValue extends FieldValueObject<IRollupFieldValue> {
  constructor(value: IRollupFieldValue) {
    super(Array.isArray(value) ? value : { value: value ?? null })
  }

  isEmpty() {
    return isEmpty(this.props)
  }
}
