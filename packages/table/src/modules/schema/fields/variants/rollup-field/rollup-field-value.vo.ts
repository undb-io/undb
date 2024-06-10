import { ValueObject } from "@undb/domain"
import { isEmpty } from "radash"

export class RollupFieldValue extends ValueObject<number | Date | null | undefined> {
  constructor(value: number | Date | null | undefined) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return isEmpty(this.props)
  }
}
