import { ParamType, type ExpressionResult } from "../types"

interface FunctionDefinition {
  paramPatterns: ParamType[][]
  returnType: ParamType
}

export class FunctionRegistry {
  private functions: Map<string, FunctionDefinition> = new Map()

  register(name: string, paramPatterns: ParamType[][], returnType: ParamType) {
    this.functions.set(name.toUpperCase(), { paramPatterns, returnType })
  }

  get(name: string): FunctionDefinition | undefined {
    return this.functions.get(name.toUpperCase())
  }

  isValid(name: string): boolean {
    return this.functions.has(name.toUpperCase())
  }

  validateArgs(name: string, args: ExpressionResult[]): void {
    const funcDef = this.get(name)
    if (!funcDef) {
      throw new Error(`Unknown function name: ${name}`)
    }

    // 检查是否有任何模式的参数数量匹配
    const hasMatchingPattern = funcDef.paramPatterns.some((pattern) => {
      // 如果模式中包含 VARIADIC，则参数数量必须大于等于 pattern.length - 1
      // 否则参数数量必须完全匹配
      if (pattern.includes(ParamType.VARIADIC)) {
        return args.length >= pattern.length - 1
      }
      return args.length === pattern.length
    })

    if (!hasMatchingPattern) {
      const expectedCounts = funcDef.paramPatterns
        .map((pattern) =>
          pattern.includes(ParamType.VARIADIC) ? `at least ${pattern.length - 1}` : `${pattern.length}`,
        )
        .join(" or ")
      throw new Error(`Function ${name} expects ${expectedCounts} arguments, but got ${args.length}`)
    }

    const isValidPattern = funcDef.paramPatterns.some((pattern) => {
      for (let i = 0; i < pattern.length; i++) {
        const expectedType = pattern[i]
        if (expectedType === ParamType.VARIADIC) {
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
      throw new Error(`Function ${name} arguments do not match: ${JSON.stringify(args)}`)
    }
  }

  private isTypeMatch(arg: ExpressionResult, expectedType: ParamType): boolean {
    if (arg.type === "functionCall") {
      return arg.returnType === expectedType
    }

    if (arg.type === "variable") {
      return true
    }

    switch (expectedType) {
      case ParamType.NUMBER:
        return arg.type === "number"
      case ParamType.STRING:
        return arg.type === "string"
      case ParamType.BOOLEAN:
        return arg.type === "boolean"
      case ParamType.DATE:
        // TODO: 假设有日期类型的处理
        return false
      case ParamType.ANY:
        return true
      default:
        return false
    }
  }
}

export const globalFunctionRegistry = new FunctionRegistry()

// 注册函数，支持多种参数模式
globalFunctionRegistry.register("ADD", [[ParamType.NUMBER, ParamType.NUMBER]], ParamType.NUMBER)
globalFunctionRegistry.register("SUBTRACT", [[ParamType.NUMBER, ParamType.NUMBER]], ParamType.NUMBER)
globalFunctionRegistry.register("MULTIPLY", [[ParamType.NUMBER, ParamType.NUMBER]], ParamType.NUMBER)
globalFunctionRegistry.register("DIVIDE", [[ParamType.NUMBER, ParamType.NUMBER]], ParamType.NUMBER)
globalFunctionRegistry.register("SUM", [[ParamType.NUMBER, ParamType.VARIADIC]], ParamType.NUMBER)
globalFunctionRegistry.register("CONCAT", [[ParamType.STRING, ParamType.VARIADIC]], ParamType.STRING)
