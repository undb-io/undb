import type { CheckboxEqual } from "./checkbox-field.specification"

export interface ICheckboxFieldValueVisitor {
  checkboxEqual(spec: CheckboxEqual): void
}
