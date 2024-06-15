import type { SelectEqual } from "./select-field-specification"

export interface ISelectFieldValueVisitor {
  selectEqual(spec: SelectEqual): void
}
