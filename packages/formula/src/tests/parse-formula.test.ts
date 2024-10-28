import { describe, expect, test } from "bun:test"
import { parseFormula } from "../util"

describe("parse formula", () => {
  test.each(["ADD(1, ADD(2, {{ field1 }}))", "ADD(1, 2)", "1", "{{field1}}"])("test %s", (input) => {
    const result = parseFormula(input)

    expect(result).toMatchSnapshot()
  })
})
