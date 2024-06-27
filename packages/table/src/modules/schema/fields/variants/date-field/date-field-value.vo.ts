import { ValueObject } from "@undb/domain"

export class DateFieldValue extends ValueObject<Date> {
  constructor(value: Date) {
    super({ value })
  }

  isEmpty() {
    return this.value === null || this.value === undefined
  }
}
