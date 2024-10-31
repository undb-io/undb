import { describe, expect, it } from "bun:test"
import { FormulaRegistry } from "./formula.registry"

describe("FormulaRegistry", () => {
  it("should register ADD functions", () => {
    const registry = new FormulaRegistry()
    registry.register("ADD", [["number", "number"]], "number")
    expect(registry.isValid("ADD")).toBe(true)
    expect(registry.get("ADD")?.syntax).toEqual(["ADD(number1, number2)"])
  })

  it("should register SUM functions", () => {
    const registry = new FormulaRegistry()
    registry.register("SUM", [["number", "variadic"]], "number")
    expect(registry.isValid("SUM")).toBe(true)
    expect(registry.get("SUM")?.syntax).toEqual(["SUM(number1, [number2, ...])"])
  })

  it("should register ABS functions", () => {
    const registry = new FormulaRegistry()
    registry.register("ABS", [["number"]], "number")
    expect(registry.isValid("ABS")).toBe(true)
    expect(registry.get("ABS")?.syntax).toEqual(["ABS(number)"])
  })
})
