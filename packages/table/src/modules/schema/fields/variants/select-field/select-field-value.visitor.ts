import type { SelectContainsAnyOf, SelectEmpty, SelectEqual } from "./select-field-specification"

export interface ISelectFieldValueVisitor {
  selectEqual(spec: SelectEqual): void
  selectContainsAnyOf(spec: SelectContainsAnyOf): void
  selectEmpty(spec: SelectEmpty): void
}
