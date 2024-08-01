import type { ReferenceEqual } from "./reference-field-value.specification"

export interface IReferenceFieldValueVisitor {
  referenceEqual(spec: ReferenceEqual): void
}
