import { ValueObject } from "@undb/domain"
import { isEmpty } from "radash"

export class UserFieldValue extends ValueObject<string> {
  constructor(value: string) {
    super({ value })
  }

  isEmpty() {
    return this.value === null || this.value === undefined || isEmpty(this.value)
  }
}
