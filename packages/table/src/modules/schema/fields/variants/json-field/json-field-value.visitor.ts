import type { JsonEmpty, JsonEqual } from "./json-field.specification"

export interface IJsonFieldValueVisitor {
  jsonEqual(spec: JsonEqual): void
  jsonEmpty(spec: JsonEmpty): void
}
