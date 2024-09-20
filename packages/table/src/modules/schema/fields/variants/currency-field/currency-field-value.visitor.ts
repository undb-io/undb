import type { CurrencyEqual, CurrencyGT, CurrencyGTE, CurrencyLT, CurrencyLTE } from "./currency-field.specification"

export interface ICurrencyFieldValueVisitor {
  currencyEqual(s: CurrencyEqual): void
  currencyGT(s: CurrencyGT): void
  currencyGTE(s: CurrencyGTE): void
  currencyLT(s: CurrencyLT): void
  currencyLTE(s: CurrencyLTE): void
}
