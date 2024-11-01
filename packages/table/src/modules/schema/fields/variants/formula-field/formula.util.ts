import { createParser } from "@undb/formula"
import type { TableDo } from "../../../../../table.do"
import { FormulaVisitor } from "./formula.visitor"

export function parseFormula(table: TableDo, input: string) {
  const parser = createParser(input)

  const tree = parser.formula()

  const visitor = new FormulaVisitor(table)
  const parsedFormula = visitor.visit(tree)

  return parsedFormula
}
