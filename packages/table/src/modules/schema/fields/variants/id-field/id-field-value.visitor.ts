import type { IdEqual } from "./id-field-value.specification"

export interface IIdFieldValueVisitor {
  idEqual(spec: IdEqual): void
}
