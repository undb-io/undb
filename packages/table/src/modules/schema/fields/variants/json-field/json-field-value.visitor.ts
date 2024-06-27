import type { IAbstractJsonFieldValueVisitor } from "../abstractions/abstract-json-value.visitor"
import type { JsonEmpty, JsonEqual } from "./json-field.specification"

export interface IJsonFieldValueVisitor extends IAbstractJsonFieldValueVisitor {
  jsonEqual(spec: JsonEqual): void
  jsonEmpty(spec: JsonEmpty): void
}
