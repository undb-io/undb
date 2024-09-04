import type { DurationEqual } from "./duration-field.specification"

export interface IDurationFieldValueVisitor {
  durationEqual(s: DurationEqual): void
}
