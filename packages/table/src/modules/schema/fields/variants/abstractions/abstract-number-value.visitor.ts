import type {
  NumberEmpty,
  NumberEqual,
  NumberGT,
  NumberGTE,
  NumberLT,
  NumberLTE,
} from "./abstract-number-value.specification"

export interface IAbstractNumberFieldValueVisitor {
  numberEqual(spec: NumberEqual): void
  numberGT(spec: NumberGT): void
  numberGTE(spec: NumberGTE): void
  numberLT(spec: NumberLT): void
  numberLTE(spec: NumberLTE): void
  numberEmpty(spec: NumberEmpty): void
}
