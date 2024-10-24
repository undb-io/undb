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
      throw new Error(`Unknown function: ${name}`)
    }

    const isValidPattern = funcDef.paramPatterns.some((pattern) => {
      if (pattern.length > args.length) {
        return false
      }

      for (let i = 0; i < pattern.length; i++) {
        const expectedType = pattern[i]
        if (expectedType === ParamType.VARIADIC) {
          // 剩余的所有参数都应该匹配 VARIADIC 的前一个类型
          const variadicType = pattern[i - 1]
          return args.slice(i).every((arg) => this.isTypeMatch(arg, variadicType))
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
