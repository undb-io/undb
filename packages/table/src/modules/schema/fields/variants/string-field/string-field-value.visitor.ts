import type { StringEqual } from './string-field-value.specification'

export interface IStringFieldValueVisitor {
  stringEqual(spec: StringEqual): void
}
