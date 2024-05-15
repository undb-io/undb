import type { CreatedAtIsSameDay } from "./created-at-field-value.specification"

export interface ICreatedAtFieldValueVisitor {
  createdAtIsSameDate(spec: CreatedAtIsSameDay): void
}
