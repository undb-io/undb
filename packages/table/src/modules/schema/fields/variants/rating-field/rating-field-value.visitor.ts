import type { IAbstractNumberFieldValueVisitor } from "../abstractions/abstract-number-value.visitor"
import type { RatingEqual } from "./rating-field.specification"

export interface IRatingFieldValueVisitor extends IAbstractNumberFieldValueVisitor {
  ratingEqual(s: RatingEqual): void
}
