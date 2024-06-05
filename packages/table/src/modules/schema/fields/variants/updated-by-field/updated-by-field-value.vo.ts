import { ValueObject } from "@undb/domain"

export class UpdatedByFieldValue extends ValueObject<string> {
  constructor(value: string) {
    super({ value })
  }
}
