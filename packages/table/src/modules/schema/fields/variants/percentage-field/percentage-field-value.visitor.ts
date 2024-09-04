import type { PercentageEqual } from "./percentage-field.specification"

export interface IPercentageFieldValueVisitor {
  percentageEqual(s: PercentageEqual): void
}
