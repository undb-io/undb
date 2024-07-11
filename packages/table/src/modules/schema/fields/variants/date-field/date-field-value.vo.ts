import { ValueObject } from "@undb/domain"
import { isString } from "radash"

export class DateFieldValue extends ValueObject<Date> {
  constructor(value: Date | string) {
    super({ value: isString(value) ? new Date(value) : value })
  }

  isEmpty() {
    return this.value === null || this.value === undefined
  }
}
