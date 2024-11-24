import { z } from "@undb/zod"
import { isEmpty } from "radash"
import type { JsonValue } from "type-fest"
import { FieldValueObject } from "../../field-value"

export type { JsonValue } from "type-fest"

const baseSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.any()),
  z.record(z.any(), z.any()),
])
export const jsonSchemaValue = baseSchema

export const mutateJsonFieldValueSchema = jsonSchemaValue

export class JsonFieldValue extends FieldValueObject<JsonValue | null | undefined> {
  constructor(value: JsonValue | null | undefined) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.value === null || this.value === undefined || isEmpty(this.value)
  }
}
