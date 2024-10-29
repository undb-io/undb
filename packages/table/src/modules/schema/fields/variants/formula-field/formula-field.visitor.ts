import {
  AbstractParseTreeVisitor,
  FormulaContext,
  FunctionCallContext,
  type FormulaFunction,
  type FormulaParserVisitor,
} from "@undb/formula"
import { globalFunctionRegistry } from "@undb/formula/src/formula/registry"
import type { TableDo } from "../../../../../table.do"

export class FormulaFieldVisitor extends AbstractParseTreeVisitor<void> implements FormulaParserVisitor<void> {
  constructor(private readonly table: TableDo) {
    super()
  }
  protected defaultResult(): void {
    return undefined
  }

  visitFormula(ctx: FormulaContext): void {
    this.visit(ctx.expression())
  }

  visitFunctionCall(ctx: FunctionCallContext): void {
    const name = ctx.IDENTIFIER().text as FormulaFunction
    // const fields = ctx
    //   .argumentList()
    //   ?.expression()
    //   .filter((exp) => exp instanceof VariableExprContext)
    //   .map((exp) => exp.variable().IDENTIFIER().text)
    //   .map((fieldId) => this.table.schema.getFieldByIdOrName(fieldId).into(null))
    //   .filter((f) => !!f)

    const fn = globalFunctionRegistry.get(name)
    if (!fn) {
      throw new Error(`Function ${name} not found`)
    }
  }
}
