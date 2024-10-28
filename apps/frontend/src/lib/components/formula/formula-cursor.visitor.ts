import {
  AbstractParseTreeVisitor,
  AddSubExprContext,
  ArgumentListContext,
  ExpressionContext,
  FormulaContext,
  FormulaParserVisitor,
  FunctionCallContext,
  FunctionExprContext,
  MulDivModExprContext,
  ParseTree,
  VariableContext,
} from "@undb/formula"

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
