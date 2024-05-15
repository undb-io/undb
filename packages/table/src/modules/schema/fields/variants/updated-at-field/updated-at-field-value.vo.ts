import { ValueObject } from "@undb/domain"

export class UpdatedAtFieldValue extends ValueObject<Date> {
  constructor(value: Date) {
    super({ value })
  }
}
