import type { IdEqual, IdIn } from "./id-field-value.specification"

export interface IIdFieldValueVisitor {
  idEqual(spec: IdEqual): void
  idIn(spec: IdIn): void
}
