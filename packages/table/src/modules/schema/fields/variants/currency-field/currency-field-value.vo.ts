import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const currencyFieldValue = z.number().nonnegative().nullable()
export type ICurrencyFieldValue = z.infer<typeof currencyFieldValue>

export class CurrencyFieldValue extends FieldValueObject<ICurrencyFieldValue> {
  constructor(value: ICurrencyFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
