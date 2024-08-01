import type { JsonContains, JsonEmpty, JsonEqual } from "./json-field.specification"

export interface IJsonFieldValueVisitor {
  jsonEqual(spec: JsonEqual): void
  jsonContains(spec: JsonContains): void
  jsonEmpty(spec: JsonEmpty): void
}
