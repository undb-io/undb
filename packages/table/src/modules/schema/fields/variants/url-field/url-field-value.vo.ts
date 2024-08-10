import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const urlFieldValue = z.string().url().optional().nullable()
export type IUrlFieldValue = z.infer<typeof urlFieldValue>

export class UrlFieldValue extends FieldValueObject<IUrlFieldValue> {
  constructor(value: IUrlFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
