import { ValueObject } from "@undb/domain"

export class AutoIncrementFieldValue extends ValueObject<number> {
  constructor(value: number) {
    super({ value })
  }
}
