import type { LongTextEqual } from "./long-text-field.specification"

export interface ILongTextFieldValueVisitor {
  longTextEqual(s: LongTextEqual): void
}
