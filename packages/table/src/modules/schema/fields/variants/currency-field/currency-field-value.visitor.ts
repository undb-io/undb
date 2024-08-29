import type { CurrencyEqual } from "./currency-field.specification"

export interface ICurrencyFieldValueVisitor {
  currencyEqual(s: CurrencyEqual): void
}
