import { isEmpty } from "radash"
import type { JsonValue } from "type-fest"
import { FieldValueObject } from "../../field-value"

export type { JsonValue } from "type-fest"

export class JsonFieldValue extends FieldValueObject<JsonValue | null | undefined> {
  constructor(value: JsonValue | null | undefined) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.value === null || this.value === undefined || isEmpty(this.value)
  }
}
