import type { SelectEmpty, SelectEqual } from "./select-field-specification"

export interface ISelectFieldValueVisitor {
  selectEqual(spec: SelectEqual): void
  selectEmpty(spec: SelectEmpty): void
}
