import type { NumberEqual, NumberGT, NumberGTE, NumberLT, NumberLTE } from './number-field-value.specification'

export interface INumberFieldValueVisitor {
  numberEqual(spec: NumberEqual): void
  numberGT(spec: NumberGT): void
  numberGTE(spec: NumberGTE): void
  numberLT(spec: NumberLT): void
  numberLTE(spec: NumberLTE): void
}
