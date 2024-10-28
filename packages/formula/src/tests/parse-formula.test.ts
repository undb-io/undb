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
  ])("test %s", (input) => {
    const result = parseFormula(input)

    expect(result).toMatchSnapshot()
  })
})
