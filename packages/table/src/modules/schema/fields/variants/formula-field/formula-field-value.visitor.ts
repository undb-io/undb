import type { FormulaEqual, FormulaGT, FormulaGTE, FormulaLT, FormulaLTE } from "./formula-field.specification"

export interface IFormulaFieldValueVisitor {
  formulaEqual(s: FormulaEqual): void
  formulaGT(s: FormulaGT): void
  formulaGTE(s: FormulaGTE): void
  formulaLT(s: FormulaLT): void
  formulaLTE(s: FormulaLTE): void
}
