import { ValueObject } from "@undb/domain"

export class CreatedAtFieldValue extends ValueObject<Date> {
  constructor(value: Date) {
    super({ value })
  }
}
