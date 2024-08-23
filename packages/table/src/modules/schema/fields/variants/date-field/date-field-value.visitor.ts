import type { DateIsEmpty } from "../abstractions/abstract-date-value.specification"
import type { IAbstractDateFieldValueVisitor } from "../abstractions/abstract-date-value.visitor"
import type { DateEqual } from "./date-field.specification"

export interface IDateFieldValueVisitor extends IAbstractDateFieldValueVisitor {
  dateEqual(spec: DateEqual): void
  dateIsEmpty(spec: DateIsEmpty): void
}
