import {
  AddSubExprContext,
  AndExprContext,
  ArgumentListContext,
  ComparisonExprContext,
  FalseExprContext,
  FormulaContext,
  FormulaParserVisitor,
  FunctionCallContext,
  FunctionExprContext,
  globalFormulaRegistry,
  MulDivModExprContext,
  NotExprContext,
  NullExprContext,
  NumberExprContext,
  OrExprContext,
  ParenExprContext,
  StringExprContext,
  TrueExprContext,
  VariableContext,
  VariableExprContext,
  type ArgumentListResult,
  type ExpressionResult,
  type FormulaFunction,
  type FunctionExpressionResult,
  type NumberResult,
  type ParamType,
  type ReturnType,
  type VariableResult,
} from "@undb/formula"
import type { TableDo } from "../../../../../table.do"
import { FormulaReturnTypeVisitor } from "./formula-return-type.visitor"

function getReturnTypeFromExpressionResult(result: ExpressionResult): ReturnType {
  if (result.type === "argumentList") {
    return "any"
  }
  if (result.type === "variable") {
    return result.returnType
  }
  if (result.type === "functionCall") {
    return result.returnType
  }
  return result.type as ReturnType
}

export class FormulaVisitor extends FormulaParserVisitor<ExpressionResult> {
  constructor(private readonly table: TableDo) {
    super()
  }
  private variables: Set<string> = new Set()

  /**
   * 验证表达式结果类型是否符合预期
   *
   * @throws {Error} 当字段不存在时抛出 "Field xxx not found"
   * @throws {Error} 当变量类型不匹配时抛出 "Expected xxx but got xxx"
   * @throws {Error} 当函数返回类型不匹配时抛出 "Expected xxx but got xxx"
   * @throws {Error} 当表达式类型不匹配时抛出 "Expected xxx but got xxx"
   */
  private assertType(result: ExpressionResult, types: ReturnType[]): boolean {
    if (result.type === "variable") {
      const field = this.table.schema.getFieldByIdOrName(result.variable).into(null)
      if (!field) {
        throw new Error(`Field ${result.variable} not found`)
      }
      const visitor = new FormulaReturnTypeVisitor()
      field.accept(visitor)
      const returnType = visitor.returnType
      if (!types.includes(returnType)) {
        throw new Error(`Expected ${types.join(" or ")} but got ${returnType}`)
      }

      return true
    }

    if (result.type === "functionCall") {
      if (!Array.isArray(result.returnType) && !types.includes(result.returnType)) {
        throw new Error(`Expected ${types.join(" or ")} but got ${result.name}`)
      }
      if (Array.isArray(result.returnType) && !result.returnType.every((type) => types.includes(type))) {
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

  visitTrueExpr = (ctx: TrueExprContext): ExpressionResult => {
    return { type: "boolean", value: true }
  }
  visitFalseExpr = (ctx: FalseExprContext): ExpressionResult => {
    return { type: "boolean", value: false }
  }
  visitNullExpr = (ctx: NullExprContext): ExpressionResult => {
    return { type: "null" }
  }

  private getFormulaReturnType(ctx: FunctionCallContext, funcName: FormulaFunction): ReturnType {
    if (funcName === "IF") {
      const args = ctx.argumentList()?.expression_list() ?? []
      if (args.length < 3) {
        throw new Error("IF function requires 3 arguments")
      }

      const thenResult = this.visit(args[1])
      const elseResult = this.visit(args[2])

      if (thenResult.type === "functionCall" || thenResult.type === "variable") {
        const thenType = Array.isArray(thenResult.returnType) ? thenResult.returnType : [thenResult.returnType]
        const elseType =
          elseResult.type === "functionCall"
            ? Array.isArray(elseResult.returnType)
              ? elseResult.returnType
              : [elseResult.returnType]
            : [elseResult.type as ReturnType]

        const allTypes = [...new Set([...thenType, ...elseType.flat()])]
        return allTypes.length === 1 ? allTypes[0] : allTypes
      }

      if (elseResult.type === "functionCall" || elseResult.type === "variable") {
        const elseType = Array.isArray(elseResult.returnType) ? elseResult.returnType : [elseResult.returnType]
        const thenType = [thenResult.type as ReturnType]

        const allTypes = [...new Set([...thenType.flat(), ...elseType])]
        return allTypes.length === 1 ? allTypes[0] : allTypes
      }

      const thenReturnType = getReturnTypeFromExpressionResult(thenResult)
      const elseReturnType = getReturnTypeFromExpressionResult(elseResult)
      if (typeof thenReturnType === "string" && typeof elseReturnType === "string") {
        if (thenReturnType === elseReturnType) {
          return thenReturnType
        }
        return [thenReturnType, elseReturnType]
      }
      if (Array.isArray(thenReturnType) && Array.isArray(elseReturnType)) {
        const allTypes = [...new Set([...thenReturnType, ...elseReturnType])]
        return allTypes.length === 1 ? allTypes[0] : allTypes
      }

      if (Array.isArray(thenReturnType) && typeof elseReturnType === "string") {
        const allTypes = [...new Set([...thenReturnType, elseReturnType])]
        return allTypes.length === 1 ? allTypes[0] : allTypes
      }
      if (Array.isArray(elseReturnType) && typeof thenReturnType === "string") {
        const allTypes = [...new Set([thenReturnType, ...elseReturnType])]
        return allTypes.length === 1 ? allTypes[0] : allTypes
      }
      return "any"
    } else if (funcName === "SWITCH") {
      const args = ctx.argumentList()?.expression_list() ?? []
      const expr = this.visit(args[0])
      const pairs = args.slice(1, -1)
      const defaultValue = this.visit(args[args.length - 1])

      // 获取所有 value 的返回类型
      const valueTypes: ReturnType[] = []
      for (let i = 1; i < pairs.length; i += 2) {
        const value = this.visit(pairs[i])
        if (value.type === "functionCall") {
          const returnType = Array.isArray(value.returnType) ? value.returnType : [value.returnType]
          valueTypes.push(...returnType)
        } else if (value.type === "variable") {
          valueTypes.push(value.returnType)
        } else {
          valueTypes.push(getReturnTypeFromExpressionResult(value))
        }
      }

      // 添加默认值的返回类型
      if (defaultValue.type === "functionCall") {
        const returnType = Array.isArray(defaultValue.returnType) ? defaultValue.returnType : [defaultValue.returnType]
        valueTypes.push(...returnType)
      } else if (defaultValue.type === "variable") {
        valueTypes.push(defaultValue.returnType)
      } else {
        valueTypes.push(getReturnTypeFromExpressionResult(defaultValue))
      }

      // 去重并返回类型
      const allTypes = [...new Set(valueTypes.flat())]
      return allTypes.length === 1 ? allTypes[0] : allTypes
    }
    const formula = globalFormulaRegistry.get(funcName)!
    return formula.returnType
  }

  validateArgs(name: FormulaFunction, args: ExpressionResult[]): void {
    const funcDef = globalFormulaRegistry.get(name)
    if (!funcDef) {
      throw new Error(`Unknown function name: ${name}`)
    }

    // 特殊处理 SWITCH 函数
    if (name === "SWITCH") {
      if (args.length < 3) {
        throw new Error(`SWITCH function expects at least 3 arguments (expr, pattern, value), but got ${args.length}`)
      }
      if (args.length % 2 !== 0) {
        throw new Error(
          `SWITCH function expects even number of arguments (expr, pattern1, value1, pattern2, value2, ..., default), but got ${args.length}`,
        )
      }
      return
    }

    // 检查是否有任何模式的参数数量匹配
    const hasMatchingPattern = funcDef.paramPatterns.some((pattern) => {
      // 如果模式中包含 VARIADIC，则参数数量必须大于等于 pattern.length - 1
      // 否则参数数量必须完全匹配
      if (pattern.includes("variadic")) {
        return args.length >= pattern.length - 1
      }
      return args.length === pattern.length
    })

    if (!hasMatchingPattern) {
      const expectedCounts = funcDef.paramPatterns
        .map((pattern) => (pattern.includes("variadic") ? `at least ${pattern.length - 1}` : `${pattern.length}`))
        .join(" or ")
      throw new Error(`Function ${name} expects ${expectedCounts} arguments, but got ${args.length}`)
    }

    const isValidPattern = funcDef.paramPatterns.some((pattern) => {
      for (let i = 0; i < pattern.length; i++) {
        const expectedType = pattern[i]
        if (expectedType === "variadic") {
          // 剩余的所有参数都应该匹配 VARIADIC 的前一个类型
          const variadicType = pattern[i - 1]
          return args.slice(i - 1).every((arg) => this.isTypeMatch(arg, variadicType))
        }
        if (!this.isTypeMatch(args[i], expectedType)) {
          return false
        }
      }
      return true
    })

    if (!isValidPattern) {
      throw new Error(
        `Function ${name} arguments do not match, expected: ${funcDef.syntax.join("\n")}, got: ${args
          .map((arg) => {
            if (!arg) {
              return "null"
            }
            if (arg.type === "functionCall" || arg.type === "variable") {
              return arg.returnType
            }
            return arg.type
          })
          .join(", ")}`,
      )
    }
  }

  private isTypeMatch(arg: ExpressionResult, expectedType: ParamType): boolean {
    if (!arg) {
      return false
    }

    if (expectedType === "any") {
      return true
    }

    if (arg.type === "functionCall" || arg.type === "variable") {
      if (arg.returnType === "any") {
        return true
      }
      if (Array.isArray(arg.returnType)) {
        return arg.returnType.includes(expectedType as any)
      }
      return arg.returnType === expectedType
    }

    switch (expectedType) {
      case "number":
        return arg.type === "number"
      case "string":
        return arg.type === "string"
      case "boolean":
        return arg.type === "boolean"
      case "date":
        // TODO: 假设有日期类型的处理
        return false
      default:
        return false
    }
  }
  visitFunctionCall = (ctx: FunctionCallContext): FunctionExpressionResult => {
    const funcName = ctx.IDENTIFIER().getText() as FormulaFunction
    const args = ctx.argumentList() ? (this.visit(ctx.argumentList()!) as FunctionExpressionResult) : undefined

    if (!globalFormulaRegistry.isValid(funcName)) {
      throw new Error(`Unknown function: ${funcName}`)
    }

    if (args) {
      this.validateArgs(funcName, args.arguments)
    }

    const returnType = this.getFormulaReturnType(ctx, funcName)

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

    const fieldId = variableName

    const field = this.table.schema.getFieldByIdOrName(fieldId).into(null)
    if (!field) {
      throw new Error(`Field ${fieldId} not found`)
    }
    const returnTypeVisitor = new FormulaReturnTypeVisitor()
    field.accept(returnTypeVisitor)
    const returnType = returnTypeVisitor.returnType

    return { type: "variable", value: raw, variable: variableName, returnType }
  }

  getVariables(): string[] {
    return Array.from(this.variables)
  }

  protected defaultResult(): ExpressionResult {
    return { type: "string", value: "" }
  }
}
