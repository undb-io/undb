import { ValueObject } from "@undb/domain"

export class CheckboxFieldValue extends ValueObject<boolean> {
  constructor(value: boolean) {
    super({ value })
  }

  isEmpty() {
    return this.value === null || this.value === undefined
  }
}
