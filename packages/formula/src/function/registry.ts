import { ParamType, ReturnType, type ExpressionResult } from "../types"
import { FormulaFunction } from "./type"

interface FunctionDefinition {
  paramPatterns: ParamType[][]
  returnType: ReturnType
}

export class FunctionRegistry {
  private functions: Map<string, FunctionDefinition> = new Map()

  register(name: FormulaFunction, paramPatterns: ParamType[][], returnType: ReturnType) {
    this.functions.set(name, { paramPatterns, returnType })
  }

  get(name: FormulaFunction): FunctionDefinition | undefined {
    return this.functions.get(name.toUpperCase())
  }

  isValid(name: string): boolean {
    return this.functions.has(name.toUpperCase())
  }

  validateArgs(name: FormulaFunction, args: ExpressionResult[]): void {
    const funcDef = this.get(name)
    if (!funcDef) {
      throw new Error(`Unknown function name: ${name}`)
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
      case "number":
        return arg.type === "number"
      case "string":
        return arg.type === "string"
      case "boolean":
        return arg.type === "boolean"
      case "date":
        // TODO: 假设有日期类型的处理
        return false
      case "any":
        return true
      default:
        return false
    }
  }
}

export const globalFunctionRegistry = new FunctionRegistry()

// 注册函数，支持多种参数模式
globalFunctionRegistry.register("ADD", [["number", "number"]], "number")
globalFunctionRegistry.register("SUBTRACT", [["number", "number"]], "number")
globalFunctionRegistry.register("MULTIPLY", [["number", "number"]], "number")
globalFunctionRegistry.register("DIVIDE", [["number", "number"]], "number")
globalFunctionRegistry.register("SUM", [["number", "variadic"]], "number")
globalFunctionRegistry.register("MOD", [["number", "number"]], "number")
globalFunctionRegistry.register("POWER", [["number", "number"]], "number")
globalFunctionRegistry.register("SQRT", [["number"]], "number")
globalFunctionRegistry.register("ABS", [["number"]], "number")
globalFunctionRegistry.register("ROUND", [["number"]], "number")
globalFunctionRegistry.register("FLOOR", [["number"]], "number")
globalFunctionRegistry.register("CEILING", [["number"]], "number")
globalFunctionRegistry.register("MIN", [["number", "variadic"]], "number")
globalFunctionRegistry.register("MAX", [["number", "variadic"]], "number")
globalFunctionRegistry.register("AVERAGE", [["number", "variadic"]], "number")

globalFunctionRegistry.register("CONCAT", [["string", "variadic"]], "string")
globalFunctionRegistry.register("UPPER", [["string"]], "string")
globalFunctionRegistry.register("LOWER", [["string"]], "string")
globalFunctionRegistry.register("TRIM", [["string"]], "string")
globalFunctionRegistry.register("LEFT", [["string", "number"]], "string")
globalFunctionRegistry.register("RIGHT", [["string", "number"]], "string")
globalFunctionRegistry.register("MID", [["string", "number", "number"]], "string")
globalFunctionRegistry.register("LEN", [["string"]], "number")
globalFunctionRegistry.register("REPLACE", [["string", "string", "string"]], "string")
globalFunctionRegistry.register("SUBSTITUTE", [["string", "string", "string", "number"]], "string")
globalFunctionRegistry.register("REPEAT", [["string", "number"]], "string")
globalFunctionRegistry.register("SEARCH", [["string", "string"]], "number")
globalFunctionRegistry.register("SUBSTR", [["string", "number", "number"]], "string")

globalFunctionRegistry.register("AND", [["boolean", "variadic"]], "boolean")
globalFunctionRegistry.register("OR", [["boolean", "variadic"]], "boolean")
globalFunctionRegistry.register("NOT", [["boolean"]], "boolean")
globalFunctionRegistry.register("ISBLANK", [["any"]], "boolean")
globalFunctionRegistry.register("ISNUMBER", [["any"]], "boolean")
globalFunctionRegistry.register("ISTEXT", [["any"]], "boolean")

// globalFunctionRegistry.register("COUNT", [["variadic"]], "number")
// globalFunctionRegistry.register("COUNTA", [["variadic"]], "number")
// globalFunctionRegistry.register("COUNTIF", [["variadic"]], "number")
// globalFunctionRegistry.register("SUMIF", [["variadic"]], "number")
