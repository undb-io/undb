import { ParamType, ReturnType, type ExpressionResult } from "../types"
import { FormulaFunction } from "./formula.type"

interface FormulaDefinition {
  paramPatterns: ParamType[][]
  returnType: ReturnType
  syntax: string[]
  description: string
  examples?: [string, any | undefined][]
}

export class FormulaRegistry {
  private functions: Map<string, FormulaDefinition> = new Map()

  register(
    name: FormulaFunction,
    paramPatterns: ParamType[][],
    returnType: ReturnType,
    description: string,
    examples?: [string, any][],
  ) {
    function generateFunctionSyntax(): string[] {
      if (paramPatterns.length === 0) {
        return [`${name}()`]
      }
      return paramPatterns.map((pattern) => {
        const params = pattern.includes("variadic")
          ? `${pattern
              .slice(0, -1)
              .map((p, i) => `${p}${i + 1}`)
              .join(", ")}, [${pattern[pattern.length - 2]}${pattern.length}, ...]`
          : pattern.length === 1
            ? pattern[0]
            : pattern.map((p, i) => `${p}${i + 1}`).join(", ")

        return `${name}(${params})`
      })
    }

    const syntax = generateFunctionSyntax()

    this.functions.set(name, { paramPatterns, returnType, syntax, description, examples })
  }

  get(name: FormulaFunction): FormulaDefinition | undefined {
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
      if (expectedType === "any") {
        return true
      }
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

export const globalFormulaRegistry = new FormulaRegistry()

// 注册函数，支持多种参数模式
globalFormulaRegistry.register("ADD", [["number", "number"]], "number", "Adds two numbers.", [
  ["ADD(1, 2)", 3],
  ["ADD({{field1}}, 1)", undefined],
])
globalFormulaRegistry.register("SUBTRACT", [["number", "number"]], "number", "Subtracts two numbers.", [
  ["SUBTRACT(1, 2)", -1],
  ["SUBTRACT({{field1}}, 1)", undefined],
])
globalFormulaRegistry.register("MULTIPLY", [["number", "number"]], "number", "Multiplies two numbers.", [
  ["MULTIPLY(1, 2)", 2],
  ["MULTIPLY({{field1}}, 2)", undefined],
])
globalFormulaRegistry.register("DIVIDE", [["number", "number"]], "number", "Divides two numbers.", [
  ["DIVIDE(1, 2)", 0.5],
  ["DIVIDE({{field1}}, 2)", undefined],
])
globalFormulaRegistry.register("SUM", [["number", "variadic"]], "number", "Sums a list of numbers.", [
  ["SUM(1, 2, 3)", 6],
  ["SUM({{field1}}, 1)", undefined],
])
globalFormulaRegistry.register(
  "MOD",
  [["number", "number"]],
  "number",
  "Returns the remainder when one number is divided by another.",
  [
    ["MOD(1, 2)", 1],
    ["MOD({{field1}}, 2)", undefined],
  ],
)
globalFormulaRegistry.register(
  "POWER",
  [["number", "number"]],
  "number",
  "Raises a number to the power of another number.",
  [
    ["POWER(2, 3)", 8],
    ["POWER({{field1}}, 2)", undefined],
  ],
)
globalFormulaRegistry.register("SQRT", [["number"]], "number", "Returns the square root of a number.", [
  ["SQRT(4)", 2],
  ["SQRT({{field1}})", undefined],
])
globalFormulaRegistry.register("ABS", [["number"]], "number", "Returns the absolute value of a number.", [
  ["ABS(-1)", 1],
  ["ABS({{field1}})", undefined],
])
globalFormulaRegistry.register(
  "ROUND",
  [["number"]],
  "number",
  "Rounds a number to a specified number of decimal places.",
  [
    ["ROUND(1.2345, 2)", 1.23],
    ["ROUND({{field1}}, 2)", undefined],
  ],
)
globalFormulaRegistry.register("FLOOR", [["number"]], "number", "Rounds a number down to the nearest integer.", [
  ["FLOOR(1.2345)", 1],
  ["FLOOR({{field1}})", undefined],
])
globalFormulaRegistry.register("CEILING", [["number"]], "number", "Rounds a number up to the nearest integer.", [
  ["CEILING(1.2345)", 2],
  ["CEILING({{field1}})", undefined],
])
globalFormulaRegistry.register("MIN", [["number", "variadic"]], "number", "Returns the smallest number in a list.", [
  ["MIN(1, 2, 3)", 1],
  ["MIN({{field1}}, 1)", undefined],
])
globalFormulaRegistry.register("MAX", [["number", "variadic"]], "number", "Returns the largest number in a list.", [
  ["MAX(1, 2, 3)", 3],
  ["MAX({{field1}}, 1)", undefined],
])
globalFormulaRegistry.register(
  "AVERAGE",
  [["number", "variadic"]],
  "number",
  "Returns the average of a list of numbers.",
  [
    ["AVERAGE(1, 2, 3)", 2],
    ["AVERAGE({{field1}}, 1)", undefined],
  ],
)

globalFormulaRegistry.register("CONCAT", [["string", "variadic"]], "string", "Concatenates a list of strings.", [
  ["CONCAT('Hello', 'World')", "HelloWorld"],
  ["CONCAT({{field1}}, 'World')", undefined],
])
globalFormulaRegistry.register("UPPER", [["string"]], "string", "Converts a string to uppercase.", [
  ["UPPER('hello')", "HELLO"],
  ["UPPER({{field1}})", undefined],
])
globalFormulaRegistry.register("LOWER", [["string"]], "string", "Converts a string to lowercase.", [
  ["LOWER('HELLO')", "hello"],
  ["LOWER({{field1}})", undefined],
])
globalFormulaRegistry.register(
  "TRIM",
  [["string"]],
  "string",
  "Removes leading and trailing whitespace from a string.",
  [
    ["TRIM('  Hello  ')", "Hello"],
    ["TRIM({{field1}})", undefined],
  ],
)
globalFormulaRegistry.register(
  "LEFT",
  [["string", "number"]],
  "string",
  "Returns the leftmost characters of a string.",
  [
    ["LEFT('Hello', 3)", "Hel"],
    ["LEFT({{field1}}, 3)", undefined],
  ],
)
globalFormulaRegistry.register(
  "RIGHT",
  [["string", "number"]],
  "string",
  "Returns the rightmost characters of a string.",
  [
    ["RIGHT('Hello', 3)", "llo"],
    ["RIGHT({{field1}}, 3)", undefined],
  ],
)
globalFormulaRegistry.register(
  "MID",
  [["string", "number", "number"]],
  "string",
  "Returns a substring from a string.",
  [
    ["MID('Hello', 2, 3)", "llo"],
    ["MID({{field1}}, 2, 3)", undefined],
  ],
)
globalFormulaRegistry.register("LEN", [["string"]], "number", "Returns the length of a string.", [
  ["LEN('Hello')", 5],
  ["LEN({{field1}})", undefined],
])
globalFormulaRegistry.register(
  "REPLACE",
  [["string", "string", "string"]],
  "string",
  "Replaces a substring within a string.",
  [
    ["REPLACE('Hello', 'e', 'o')", "Holl"],
    ["REPLACE({{field1}}, 'e', 'o')", undefined],
  ],
)
globalFormulaRegistry.register(
  "SUBSTITUTE",
  [["string", "string", "string", "number"]],
  "string",
  "Replaces a substring within a string.",
  [
    ["SUBSTITUTE('Hello', 'e', 'o', 1)", "Holl"],
    ["SUBSTITUTE({{field1}}, 'e', 'o', 1)", undefined],
  ],
)
globalFormulaRegistry.register(
  "REPEAT",
  [["string", "number"]],
  "string",
  "Repeats a string a specified number of times.",
  [
    ["REPEAT('Hello', 3)", "HelloHelloHello"],
    ["REPEAT({{field1}}, 3)", undefined],
  ],
)
globalFormulaRegistry.register(
  "SEARCH",
  [["string", "string"]],
  "number",
  "Returns the position of a substring within a string.",
  [
    ["SEARCH('Hello', 'e')", 1],
    ["SEARCH({{field1}}, 'e')", undefined],
  ],
)
globalFormulaRegistry.register(
  "SUBSTR",
  [["string", "number", "number"]],
  "string",
  "Returns a substring from a string.",
  [
    ["SUBSTR('Hello', 2, 3)", "ll"],
    ["SUBSTR({{field1}}, 2, 3)", undefined],
  ],
)

globalFormulaRegistry.register("AND", [["boolean", "variadic"]], "boolean", "Returns true if all arguments are true.", [
  ["AND(true, true)", true],
  ["AND({{field1}}, true)", undefined],
])
globalFormulaRegistry.register("OR", [["boolean", "variadic"]], "boolean", "Returns true if any argument is true.", [
  ["OR(true, false)", true],
  ["OR({{field1}}, false)", undefined],
])
globalFormulaRegistry.register("NOT", [["boolean"]], "boolean", "Returns the opposite of a boolean value.", [
  ["NOT(true)", false],
  ["NOT({{field1}})", undefined],
])
globalFormulaRegistry.register("ISBLANK", [["any"]], "boolean", "Returns true if the value is blank.", [
  ["ISBLANK('')", true],
  ["ISBLANK({{field1}})", undefined],
])
globalFormulaRegistry.register("ISNUMBER", [["any"]], "boolean", "Returns true if the value is a number.", [
  ["ISNUMBER(1)", true],
  ["ISNUMBER({{field1}})", undefined],
])
globalFormulaRegistry.register("ISTEXT", [["any"]], "boolean", "Returns true if the value is a text.", [
  ["ISTEXT('Hello')", true],
  ["ISTEXT({{field1}})", undefined],
])

globalFormulaRegistry.register("JSON_EXTRACT", [["string", "string"]], "any", "Extracts a value from a JSON string.", [
  ["JSON_EXTRACT('{\"name\":\"John\"}', '$.name')", "John"],
  ["JSON_EXTRACT({{field1}}, '$.name')", undefined],
])

globalFormulaRegistry.register("RECORD_ID", [], "string", "Returns the ID of the current record.", [
  ["RECORD_ID()", "rec1"],
])
globalFormulaRegistry.register(
  "AUTO_INCREMENT",
  [],
  "number",
  "Returns the next value in an auto-incrementing sequence.",
  [["AUTO_INCREMENT()", 1]],
)

globalFormulaRegistry.register(
  "IF",
  [["boolean", "any", "any"]],
  "any",
  "Returns one value if a condition is true and another value if it is false.",
  [
    ["IF(1 < 2, 1, 2)", 1],
    ["IF({{field1}} > {{field2}}, {{field1}}, {{field2}})", undefined],
    ["IF({{field1}} > {{field2}}, ADD({{field1}}, {{field2}}), SUBTRACT({{field1}}, {{field2}}))", undefined],
  ],
)
