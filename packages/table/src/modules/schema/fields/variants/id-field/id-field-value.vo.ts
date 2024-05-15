import { ValueObject } from "@undb/domain"

export class IdFieldValue extends ValueObject<string> {
  constructor(value: string) {
    super({ value })
  }
}
