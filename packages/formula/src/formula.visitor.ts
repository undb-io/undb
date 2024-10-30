import { FormulaFunction } from "./formula/formula.type"
import { globalFunctionRegistry } from "./formula/registry"
import {
  AddSubExprContext,
  AndExprContext,
  ArgumentListContext,
  ComparisonExprContext,
  FormulaContext,
  FunctionCallContext,
  FunctionExprContext,
  MulDivModExprContext,
  NotExprContext,
  NumberExprContext,
  OrExprContext,
  ParenExprContext,
  StringExprContext,
  VariableContext,
  VariableExprContext,
} from "./grammar/FormulaParser"
import FormulaParserVisitor from "./grammar/FormulaParserVisitor"
import {
  ArgumentListResult,
  ReturnType,
  type ExpressionResult,
  type FunctionExpressionResult,
  type NumberResult,
  type VariableResult,
} from "./types"

export class FormulaVisitor extends FormulaParserVisitor<ExpressionResult> {
  private variables: Set<string> = new Set()

  private assertType(result: ExpressionResult, types: ReturnType[]): boolean {
    if (result.type === "variable") {
      return true
    }

    if (result.type === "functionCall") {
      if (!types.includes(result.returnType)) {
        throw new Error(`Expected ${types.join(" or ")} but got ${result.name}`)
      }
      return true
    }

    if (!types.includes(result.type as ReturnType)) {
      throw new Error(`Expected ${types.join(" or ")} but got ${result.type}`)
    }

    return true
  }

  visitFormula = (ctx: FormulaContext): ExpressionResult => {
    return this.visit(ctx.expression())
  }

  visitMulDivModExpr = (ctx: MulDivModExprContext): ExpressionResult => {
    const left = this.visit(ctx.expression(0)) as NumberResult | VariableResult
    const right = this.visit(ctx.expression(1)) as NumberResult | VariableResult

    this.assertType(left, ["number"])
    this.assertType(right, ["number"])

    const op = ctx._op.text!
    return {
      type: "functionCall",
      name: op,
      arguments: [left, right],
      returnType: "number",
      value: ctx.getText(),
    }
  }

  visitAddSubExpr = (ctx: AddSubExprContext): ExpressionResult => {
    const left = this.visit(ctx.expression(0)) as NumberResult | VariableResult
    const right = this.visit(ctx.expression(1)) as NumberResult | VariableResult

    this.assertType(left, ["number"])
    this.assertType(right, ["number"])

    const op = ctx._op.text!
    return {
      type: "functionCall",
      name: op,
      arguments: [left, right],
      returnType: "number",
      value: ctx.getText(),
    }
  }

  visitComparisonExpr = (ctx: ComparisonExprContext): ExpressionResult => {
    const left = this.visit(ctx.expression(0))
    const right = this.visit(ctx.expression(1))

    this.assertType(left, ["number"])
    this.assertType(right, ["number"])

    const op = ctx._op.text!
    return {
      type: "functionCall",
      name: op,
      arguments: [left, right],
      returnType: "boolean",
      value: ctx.getText(),
    }
  }

  visitAndExpr = (ctx: AndExprContext): ExpressionResult => {
    const left = this.visit(ctx.expression(0))
    const right = this.visit(ctx.expression(1))

    this.assertType(left, ["boolean"])
    this.assertType(right, ["boolean"])

    return {
      type: "functionCall",
      name: "AND",
      arguments: [left, right],
      returnType: "boolean",
      value: ctx.getText(),
    }
  }

  visitOrExpr = (ctx: OrExprContext): ExpressionResult => {
    const left = this.visit(ctx.expression(0))
    const right = this.visit(ctx.expression(1))

    this.assertType(left, ["boolean"])
    this.assertType(right, ["boolean"])

    return {
      type: "functionCall",
      name: "OR",
      arguments: [left, right],
      returnType: "boolean",
      value: ctx.getText(),
    }
  }

  visitNotExpr = (ctx: NotExprContext): ExpressionResult => {
    const expr = this.visit(ctx.expression())
    this.assertType(expr, ["boolean"])
    return {
      type: "functionCall",
      name: "NOT",
      arguments: [expr],
      returnType: "boolean",
      value: ctx.getText(),
    }
  }

  visitFunctionExpr = (ctx: FunctionExprContext): ExpressionResult => {
    return this.visit(ctx.functionCall())
  }

  visitVariableExpr = (ctx: VariableExprContext): ExpressionResult => {
    return this.visit(ctx.variable())
  }

  visitNumberExpr = (ctx: NumberExprContext): ExpressionResult => {
    return { type: "number", value: Number(ctx.NUMBER().getText()) }
  }

  visitStringExpr = (ctx: StringExprContext): ExpressionResult => {
    return { type: "string", value: ctx.STRING().getText().slice(1, -1) }
  }

  visitParenExpr = (ctx: ParenExprContext): ExpressionResult => {
    return this.visit(ctx.expression())
  }

  visitFunctionCall = (ctx: FunctionCallContext): ExpressionResult => {
    const funcName = ctx.IDENTIFIER().getText() as FormulaFunction
    const args = ctx.argumentList() ? (this.visit(ctx.argumentList()!) as FunctionExpressionResult) : undefined

    if (!globalFunctionRegistry.isValid(funcName)) {
      throw new Error(`Unknown function: ${funcName}`)
    }

    if (args) {
      globalFunctionRegistry.validateArgs(funcName, args.arguments)
    }

    const returnType = globalFunctionRegistry.get(funcName)!.returnType

    return {
      type: "functionCall",
      name: funcName,
      arguments: args?.arguments ?? [],
      returnType,
      value: ctx.getText(),
    }
  }

  visitArgumentList = (ctx: ArgumentListContext): ArgumentListResult => {
    const args = ctx.expression_list().map((expr) => this.visit(expr))
    return {
      type: "argumentList",
      arguments: args,
    }
  }
  visitVariable = (ctx: VariableContext): VariableResult => {
    const variableName = ctx.IDENTIFIER().getText()
    const raw = ctx.getText()
    this.variables.add(variableName)
    return { type: "variable", value: raw, variable: variableName }
  }

  getVariables(): string[] {
    return Array.from(this.variables)
  }

  protected defaultResult(): ExpressionResult {
    return { type: "string", value: "" }
  }
}
