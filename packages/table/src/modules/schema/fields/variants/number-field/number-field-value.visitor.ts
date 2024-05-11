import type { NumberEqual } from './number-field-value.specification'

export interface INumberFieldValueVisitor {
  numberEqual(spec: NumberEqual): void
}
