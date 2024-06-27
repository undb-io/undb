import { ValueObject } from "@undb/domain"
import { isEmpty } from "radash"
import type { JsonValue } from "type-fest"

export class JsonFieldValue extends ValueObject<JsonValue> {
  constructor(value: JsonValue) {
    super({ value })
  }

  isEmpty() {
    return this.value === null || this.value === undefined || isEmpty(this.value)
  }
}
