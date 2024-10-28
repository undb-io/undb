import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor"
import { ParseTree } from "antlr4ts/tree/ParseTree"
import { globalFunctionRegistry } from "./function/registry"
import {
  AddSubExprContext,
  ArgumentListContext,
  ExpressionContext,
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
import {
  type ExpressionResult,
  type FunctionExpressionResult,
  type NumberResult,
  ParamType,
  type VariableResult,
} from "./types"

export class CustomFormulaVisitor
  extends AbstractParseTreeVisitor<ExpressionResult>
  implements FormulaParserVisitor<ExpressionResult>
{
  private variables: Set<string> = new Set()

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
      returnType: ParamType.NUMBER,
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
      returnType: ParamType.NUMBER,
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
    const funcName = ctx.IDENTIFIER().text
    const args = ctx.argumentList() ? (this.visit(ctx.argumentList()!) as FunctionExpressionResult) : undefined

    if (!globalFunctionRegistry.isValid(funcName) || !args) {
      throw new Error(`Unknown function: ${funcName}`)
    }

    globalFunctionRegistry.validateArgs(funcName, args.arguments)

    const returnType = globalFunctionRegistry.get(funcName)!.returnType

    return {
      type: "functionCall",
      name: funcName,
      arguments: Array.isArray(args) ? args : [args],
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
    this.variables.add(variableName)
    const raw = `{{${variableName}}}`
    return { type: "variable", value: raw, variable: variableName }
  }

  getVariables(): string[] {
    return Array.from(this.variables)
  }

  protected defaultResult(): ExpressionResult {
    return { type: "string", value: "" }
  }
}

export class FormulaCursorVisitor extends AbstractParseTreeVisitor<void> implements FormulaParserVisitor<void> {
  private pathNodes: ParseTree[] = []
  private variables: Set<string> = new Set()
  public readonly targetPosition: number

  constructor(position: number) {
    super()
    this.targetPosition = position
  }

  public hasAggumentList(): boolean {
    return this.pathNodes.some((node) => node instanceof ArgumentListContext)
  }

  public hasFunctionCall(): boolean {
    return this.pathNodes.some((node) => node instanceof FunctionCallContext)
  }

  public getNearestFunctionNode() {
    for (let i = this.pathNodes.length - 1; i >= 0; i--) {
      const node = this.pathNodes[i]
      if (node instanceof FunctionCallContext) {
        return node
      }
    }
    return null
  }

  public getFunctionName(): string | undefined {
    const functionCall = this.getNearestFunctionNode()
    return functionCall?.IDENTIFIER()?.text
  }

  protected defaultResult(): void {
    return undefined
  }

  public getPathNodes() {
    return this.pathNodes
  }

  visitPositionInRange(ctx: ExpressionContext) {
    if (!ctx.start || !ctx.stop) return

    const start = ctx.start.startIndex
    const stop = ctx.stop.stopIndex
    const isPositionWithinRange = start <= this.targetPosition && stop >= this.targetPosition

    if (isPositionWithinRange) {
      this.pathNodes.push(ctx)
      this.visitChildren(ctx)
    }
  }

  visitFormula(ctx: FormulaContext) {
    this.visitPositionInRange(ctx)
  }

  visitMulDivModExpr(ctx: MulDivModExprContext) {
    this.visitPositionInRange(ctx)
  }

  visitAddSubExpr(ctx: AddSubExprContext) {
    this.visitPositionInRange(ctx)
  }

  visitFunctionExpr(ctx: FunctionExprContext) {
    this.visitPositionInRange(ctx)
  }

  visitFunctionCall(ctx: FunctionCallContext) {
    this.visitPositionInRange(ctx)
  }

  visitArgumentList(ctx: ArgumentListContext) {
    this.visitPositionInRange(ctx)
  }

  visitVariable(ctx: VariableContext) {
    this.variables.add(ctx.IDENTIFIER().text)
    this.visitPositionInRange(ctx)
  }
}
