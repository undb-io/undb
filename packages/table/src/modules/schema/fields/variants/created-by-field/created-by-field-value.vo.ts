import { ValueObject } from "@undb/domain"

export class CreatedByFieldValue extends ValueObject<string> {
  constructor(value: string) {
    super({ value })
  }
}
