import { ValueObject } from "@undb/domain"

export class ReferenceFieldValue extends ValueObject<string[]> {
  constructor(value: string[]) {
    super(value)
  }
}
