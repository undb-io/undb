import { createParser, type ExpressionResult, type ReturnType } from "@undb/formula"
import type { TableDo } from "../../../../../table.do"
import { FormulaVisitor } from "./formula.visitor"

export function parseFormula(table: TableDo, input: string) {
  const parser = createParser(input)

  const tree = parser.formula()

  const visitor = new FormulaVisitor(table)
  const parsedFormula = visitor.visit(tree)

  return parsedFormula
}

export function getReturnTypeFromExpressionResult(result: ExpressionResult): ReturnType {
  if (result.type === "variable" || result.type === "functionCall") {
    return result.returnType
  }

  if (result.type === "argumentList") {
    return "any"
  }

  return result.type as ReturnType
}

export function getReturnTypeFromFormula(table: TableDo, input: string) {
  const parsedFormula = parseFormula(table, input)
  return getReturnTypeFromExpressionResult(parsedFormula)
}
