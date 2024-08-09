import type { UrlEqual } from "./url-field.specification"

export interface IUrlFieldValueVisitor {
  urlEqual(s: UrlEqual): void
}
