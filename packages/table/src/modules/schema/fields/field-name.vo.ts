import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const fieldName = z.string().min(2, { message: "field name contains at least 2 chars" })

export type IFieldName = z.infer<typeof fieldName>

export class FieldNameVo extends ValueObject {
  constructor(value: string) {
    super({ value })
  }
}
