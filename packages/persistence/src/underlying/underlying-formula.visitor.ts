import {
  AbstractParseTreeVisitor,
  AddSubExprContext,
  ArgumentListContext,
  FormulaContext,
  FunctionCallContext,
  FunctionExprContext,
  MulDivModExprContext,
  NumberExprContext,
  ParenExprContext,
  StringExprContext,
  VariableContext,
  VariableExprContext,
  type FormulaFunction,
  type FormulaParserVisitor,
} from "@undb/formula"
import { FieldIdVo, type TableDo } from "@undb/table"
import { match } from "ts-pattern"

export class UnderlyingFormulaVisitor extends AbstractParseTreeVisitor<string> implements FormulaParserVisitor<string> {
  constructor(private readonly table: TableDo) {
    super()
  }

  protected defaultResult(): string {
    return ""
  }

  visitNumberExpr(ctx: NumberExprContext): string {
    return ctx.NUMBER().text
  }

  visitStringExpr(ctx: StringExprContext): string {
    return ctx.STRING().text
  }

  visitAddSubExpr(ctx: AddSubExprContext): string {
    return this.visit(ctx.expression(0)) + ctx._op.text + this.visit(ctx.expression(1))
  }

  visitMulDivModExpr(ctx: MulDivModExprContext): string {
    return this.visit(ctx.expression(0)) + ctx._op.text + this.visit(ctx.expression(1))
  }

  visitVariable(ctx: VariableContext): string {
    const variable = ctx.text
    const fieldId = ctx.IDENTIFIER().text
    const field = this.table.schema.getFieldById(new FieldIdVo(fieldId)).expect("field not found")
    const trimmed = variable.replace(/^\{\{|\}\}$/g, "").trim()
    if (field.type === "currency") {
      return `(${trimmed}/100)`
    }
    return trimmed
  }

  visitFormula(ctx: FormulaContext): string {
    const expr = ctx.expression()
    return this.visit(expr)
  }

  visitFunctionExpr(ctx: FunctionExprContext): string {
    return this.visit(ctx.functionCall())
  }

  visitVariableExpr(ctx: VariableExprContext): string {
    return this.visit(ctx.variable())
  }

  visitParenExpr(ctx: ParenExprContext): string {
    return this.visit(ctx.expression())
  }

  private arguments(ctx: ArgumentListContext): string[] {
    return ctx.expression().map((expr) => this.visit(expr))
  }
  visitFunctionCall(ctx: FunctionCallContext): string {
    const functionName = ctx.IDENTIFIER().text as FormulaFunction
    return match(functionName)
      .with("ADD", "SUM", () => {
        const fn = this.arguments(ctx.argumentList()!).join(" + ")
        return `(${fn})`
      })
      .with("SUBTRACT", () => {
        const fn = this.arguments(ctx.argumentList()!).join(" - ")
        return `(${fn})`
      })
      .with("MULTIPLY", () => {
        const fn = this.arguments(ctx.argumentList()!).join(" * ")
        return `(${fn})`
      })
      .with("DIVIDE", () => {
        const fn = this.arguments(ctx.argumentList()!).join(" / ")
        return `(${fn})`
      })
      .with("CONCAT", () => {
        const fn = this.arguments(ctx.argumentList()!)
          .map((arg) => `COALESCE(${arg}, '')`)
          .join(" || ")
        return `(${fn})`
      })
      .with("AVERAGE", () => {
        const args = this.arguments(ctx.argumentList()!)
        return `(
        (${args.map((arg) => `COALESCE(${arg}, 0)`).join(" + ")})
        /
        (NULLIF(
          ${args.map((arg) => `(CASE WHEN ${arg} IS NULL THEN 0 ELSE 1 END)`).join(" + ")}
        , 0)
        ))`
      })
      .with("LEFT", () => {
        const args = this.arguments(ctx.argumentList()!)
        return `SUBSTR(${args[0]}, 1, ${args[1]})`
      })
      .with("RIGHT", () => {
        const args = this.arguments(ctx.argumentList()!)
        return `SUBSTR(${args[0]}, -${args[1]}, ${args[1]})`
      })
      .with("MID", () => {
        const args = this.arguments(ctx.argumentList()!)
        return `SUBSTR(${args[0]}, ${args[1]}, ${args[2]})`
      })
      .otherwise(() => {
        const args = ctx.argumentList() ? this.visit(ctx.argumentList()!) : ""
        return `${functionName.toLowerCase()}(${args})`
      })
  }

  visitArgumentList(ctx: ArgumentListContext): string {
    return this.arguments(ctx).join(", ")
  }
}
