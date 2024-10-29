import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor"
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
import type { FormulaParserVisitor } from "./grammar/FormulaParserVisitor"
import {
  ReturnType,
  type ExpressionResult,
  type FunctionExpressionResult,
  type NumberResult,
  type VariableResult,
} from "./types"

export class FormulaVisitor
  extends AbstractParseTreeVisitor<ExpressionResult>
  implements FormulaParserVisitor<ExpressionResult>
{
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

  visitFormula(ctx: FormulaContext): ExpressionResult {
    return this.visit(ctx.expression())
  }

  visitMulDivModExpr(ctx: MulDivModExprContext): ExpressionResult {
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
      value: ctx.text,
    }
  }

  visitAddSubExpr(ctx: AddSubExprContext): ExpressionResult {
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
      value: ctx.text,
    }
  }

  visitComparisonExpr(ctx: ComparisonExprContext): ExpressionResult {
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
      value: ctx.text,
    }
  }

  visitAndExpr(ctx: AndExprContext): ExpressionResult {
    const left = this.visit(ctx.expression(0))
    const right = this.visit(ctx.expression(1))

    this.assertType(left, ["boolean"])
    this.assertType(right, ["boolean"])

    return {
      type: "functionCall",
      name: "AND",
      arguments: [left, right],
      returnType: "boolean",
      value: ctx.text,
    }
  }

  visitOrExpr(ctx: OrExprContext): ExpressionResult {
    const left = this.visit(ctx.expression(0))
    const right = this.visit(ctx.expression(1))

    this.assertType(left, ["boolean"])
    this.assertType(right, ["boolean"])

    return {
      type: "functionCall",
      name: "OR",
      arguments: [left, right],
      returnType: "boolean",
      value: ctx.text,
    }
  }

  visitNotExpr(ctx: NotExprContext): ExpressionResult {
    const expr = this.visit(ctx.expression())
    this.assertType(expr, ["boolean"])
    return {
      type: "functionCall",
      name: "NOT",
      arguments: [expr],
      returnType: "boolean",
      value: ctx.text,
    }
  }

  visitFunctionExpr(ctx: FunctionExprContext): ExpressionResult {
    return this.visit(ctx.functionCall())
  }

  visitVariableExpr(ctx: VariableExprContext): ExpressionResult {
    return this.visit(ctx.variable())
  }

  visitNumberExpr(ctx: NumberExprContext): ExpressionResult {
    return { type: "number", value: Number(ctx.NUMBER().text) }
  }

  visitStringExpr(ctx: StringExprContext): ExpressionResult {
    return { type: "string", value: ctx.STRING().text.slice(1, -1) }
  }

  visitParenExpr(ctx: ParenExprContext): ExpressionResult {
    return this.visit(ctx.expression())
  }

  visitFunctionCall(ctx: FunctionCallContext): ExpressionResult {
    const funcName = ctx.IDENTIFIER().text as FormulaFunction
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
      value: ctx.text,
    }
  }

  visitArgumentList(ctx: ArgumentListContext): ExpressionResult {
    const args = ctx.expression().map((expr) => this.visit(expr))
    return {
      type: "argumentList",
      arguments: args,
    }
  }
  visitVariable(ctx: VariableContext): ExpressionResult {
    const variableName = ctx.IDENTIFIER().text
    const raw = ctx.text
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
