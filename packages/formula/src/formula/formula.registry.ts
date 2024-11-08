import { ParamType, ReturnType } from "../types"
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
      if (name === "SWITCH") {
        return [`${name}(expr, [pattern, value, ..., default])`]
      }

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

globalFormulaRegistry.register("CONCAT", [["any", "variadic"]], "string", "Concatenates a list of strings.", [
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

globalFormulaRegistry.register(
  "SWITCH",
  [["any", "variadic"]],
  "any",
  "Returns the first value that matches the condition.",
  [
    ["SWITCH(1, 1, 'one', 2, 'two', 3, 'three')", "one"],
    ["SWITCH({{field1}}, 1, 'one', 2, 'two', 3, 'three')", undefined],
  ],
)

globalFormulaRegistry.register(
  "XOR",
  [["boolean", "variadic"]],
  "boolean",
  "Returns true if an odd number of arguments are true.",
  [
    ["XOR(true, false)", true],
    ["XOR(1 < 2, 5 < 3, 8 < 10)", false],
    ["XOR({{field1}}, false)", undefined],
  ],
)

globalFormulaRegistry.register("DATE_ADD", [["date", "number", "string"]], "date", "Adds a number of date to date", [
  ["DATE_ADD('2024-01-01', 1, 'day')", "2024-01-02"],
  ["DATE_ADD('2024-01-01', 1, 'month')", "2024-02-01"],
  ["DATE_ADD('2024-01-01', 1, 'year')", "2025-01-01"],
  ["DATE_ADD('2024-01-01', 1, 'hour')", "2024-01-01 01:00:00"],
  ["DATE_ADD('2024-01-01', 1, 'minute')", "2024-01-01 00:01:00"],
  ["DATE_ADD('2024-01-01', 1, 'second')", "2024-01-01 00:00:01"],
  ["DATE_ADD({{field1}}, 1, 'day')", undefined],
])
globalFormulaRegistry.register(
  "DATE_SUBTRACT",
  [["date", "number", "string"]],
  "date",
  "Subtracts a number of date from date",
  [
    ["DATE_SUBTRACT('2024-01-01', 1, 'day')", "2023-12-31"],
    ["DATE_SUBTRACT('2024-01-01', 1, 'month')", "2023-12-01"],
    ["DATE_SUBTRACT('2024-01-01', 1, 'year')", "2023-01-01"],
    ["DATE_SUBTRACT('2024-01-01', 1, 'hour')", "2023-12-31 23:00:00"],
    ["DATE_SUBTRACT('2024-01-01', 1, 'minute')", "2023-12-31 23:59:00"],
    ["DATE_SUBTRACT('2024-01-01', 1, 'second')", "2023-12-31 23:59:59"],
    ["DATE_SUBTRACT({{field1}}, 1, 'day')", undefined],
  ],
)

globalFormulaRegistry.register(
  "DATE_DIFF",
  [["date", "date", "string"]],
  "number",
  "Returns the difference between two dates in the specified unit.",
  [
    ["DATE_DIFF('2024-01-01', '2024-01-02', 'day')", 1],
    ["DATE_DIFF('2024-01-01', '2024-01-02', 'month')", 0],
    ["DATE_DIFF('2024-01-01', '2024-01-02', 'year')", 0],
    ["DATE_DIFF({{field1}}, {{field2}}, 'day')", undefined],
  ],
)

globalFormulaRegistry.register("YEAR", [["date"]], "number", "Returns the year of a date.", [
  ["YEAR('2024-01-01')", 2024],
  ["YEAR({{field1}})", undefined],
])
globalFormulaRegistry.register("MONTH", [["date"]], "number", "Returns the month of a date.", [
  ["MONTH('2024-01-01')", 1],
  ["MONTH({{field1}})", undefined],
])
globalFormulaRegistry.register("DAY", [["date"]], "number", "Returns the day of a date.", [
  ["DAY('2024-01-01')", 1],
  ["DAY({{field1}})", undefined],
])
globalFormulaRegistry.register("HOUR", [["date"]], "number", "Returns the hour of a date.", [
  ["HOUR('2024-01-01 01:00:00')", 1],
  ["HOUR({{field1}})", undefined],
])
globalFormulaRegistry.register("MINUTE", [["date"]], "number", "Returns the minute of a date.", [
  ["MINUTE('2024-01-01 01:00:00')", 0],
  ["MINUTE({{field1}})", undefined],
])
globalFormulaRegistry.register("SECOND", [["date"]], "number", "Returns the second of a date.", [
  ["SECOND('2024-01-01 01:00:00')", 0],
  ["SECOND({{field1}})", undefined],
])
globalFormulaRegistry.register("WEEKDAY", [["date"]], "number", "Returns the weekday of a date.", [
  ["WEEKDAY('2024-01-01')", 2],
  ["WEEKDAY({{field1}})", undefined],
])
