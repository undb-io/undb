import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor"
import { globalFunctionRegistry } from "./function/registry"
import { FormulaFunction } from "./function/type"
import {
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
} from "./grammar/FormulaParser"
import type { FormulaParserVisitor } from "./grammar/FormulaParserVisitor"
import { type ExpressionResult, type FunctionExpressionResult, type NumberResult, type VariableResult } from "./types"

export class FormulaVisitor
  extends AbstractParseTreeVisitor<ExpressionResult>
  implements FormulaParserVisitor<ExpressionResult>
{
  visitFormula(ctx: FormulaContext): ExpressionResult {
    return this.visit(ctx.expression())
  }

  visitMulDivModExpr(ctx: MulDivModExprContext): ExpressionResult {
    const left = this.visit(ctx.expression(0)) as NumberResult | VariableResult
    const right = this.visit(ctx.expression(1)) as NumberResult | VariableResult
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
    const left = this.visit(ctx.expression(0)) as NumberResult
    const right = this.visit(ctx.expression(1)) as NumberResult
    const op = ctx._op.text!
    return {
      type: "functionCall",
      name: op,
      arguments: [left, right],
      returnType: "number",
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
      arguments: Array.isArray(args) ? args : args ? [args] : [],
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
    return { type: "variable", value: raw, variable: variableName }
  }

  protected defaultResult(): ExpressionResult {
    return { type: "string", value: "" }
  }
}
