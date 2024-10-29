import { describe, expect, test } from "bun:test"
import { parseFormula } from "../util"

describe("parse formula", () => {
  test.each([
    //
    "ADD(1, ADD(2, {{ field1 }}))",
    "ADD(1, 2)",
    "SUBTRACT(1, 2)",
    "MULTIPLY(1, 2)",
    "DIVIDE(1, 2)",
    "1 - 1",
    "1 * 1",
    "1 / 1",
    "SUBTRACT(1, 2) + MULTIPLY(3, 4)",
    "1",
    "{{field1}}",
    "1 + 1",
    "{{field1}} + {{field2}}",
    "SUM({{field1}}, {{field2}})",
    "CONCAT({{field1}}, {{field2}})",
    "CONCAT({{field1}}, {{field2}}, {{field3}})",
    "MOD(1, 2)",
    "MOD({{field1}}, {{field2}})",
    "POWER(2, 3)",
    "POWER({{field1}}, {{field2}})",
    "SQRT(4)",
    "SQRT({{field1}})",
    "ABS(-5)",
    "ABS({{field1}})",
    "ROUND(1.234)",
    "ROUND({{field1}})",
    "FLOOR(1.234)",
    "FLOOR({{field1}})",
    "CEILING(1.234)",
    "CEILING({{field1}})",
    "MIN(1, 2)",
    "MIN({{field1}}, {{field2}})",
    "MIN({{field1}}, {{field2}}, {{field3}})",
    "MAX(1, 2)",
    "MAX({{field1}}, {{field2}})",
    "MAX({{field1}}, {{field2}}, {{field3}})",
    "AVERAGE(1, 2, 3)",
    "AVERAGE({{field1}}, {{field2}}, {{field3}})",
    "CONCAT({{field1}}, {{field2}})",
    "CONCAT({{field1}}, {{field2}}, {{field3}})",
    "LEFT({{field1}}, 3)",
    "RIGHT({{field1}}, 3)",
    "MID({{field1}}, 2, 3)",
  ])("test %s", (input) => {
    const result = parseFormula(input)

    expect(result).toMatchSnapshot()
  })
})
