import { describe, expect, it } from "bun:test"
import {
  castFieldValue,
  getIsDisplayFieldType,
  getIsFieldCanBeRollup,
  getIsFieldHasDisplayValue,
  getIsFilterableFieldType,
  getIsMutableFieldType,
  getIsSystemFieldType,
  getRollupFnByType,
  inferCreateFieldType,
  isCurrencyValue,
  isDateValue,
  isFieldSortable,
  isJsonValue,
  isNumberValue,
} from "./field.util"
import type { ICreateSelectFieldDTO } from "./variants/select-field/select-field.vo"

describe("field.util", () => {
  describe("isDateValue", () => {
    it("should return true for valid date strings", () => {
      expect(isDateValue("2023-05-01")).toBe(true)
    })

    it("should return false for invalid date strings", () => {
      expect(isDateValue("not a date")).toBe(false)
    })

    it("should return false for non-string values", () => {
      expect(isDateValue(123)).toBe(false)
    })
  })

  describe("isJsonValue", () => {
    it("should return true for objects", () => {
      expect(isJsonValue({})).toBe(true)
    })

    it("should return false for non-objects", () => {
      expect(isJsonValue("string")).toBe(false)
    })
  })

  describe("isCurrencyValue", () => {
    it("should check if is currency value", () => {
      expect(isCurrencyValue(1000)).toBe(true)
      expect(isCurrencyValue("1,000.00")).toBe(true)
      expect(isCurrencyValue("1,000")).toBe(true)
      expect(isCurrencyValue("1000.50")).toBe(true)
      expect(isCurrencyValue("not a currency")).toBe(false)
    })
  })

  describe("isNumberValue", () => {
    it("should return true for numbers", () => {
      expect(isNumberValue(123)).toBe(true)
    })

    it("should return true for numeric strings", () => {
      expect(isNumberValue("123.45")).toBe(true)
    })

    it("should return false for non-numeric values", () => {
      expect(isNumberValue("abc")).toBe(false)
    })
  })

  describe("inferCreateFieldType", () => {
    it("should infer email type", () => {
      expect(inferCreateFieldType(["test@example.com"])).toEqual({ type: "email" })
    })

    it("should infer url type", () => {
      expect(inferCreateFieldType(["https://example.com"])).toEqual({ type: "url" })
    })

    it("should infer checkbox type", () => {
      expect(inferCreateFieldType([true, false])).toEqual({ type: "checkbox" })
    })

    it("should infer number type", () => {
      expect(inferCreateFieldType([1, 2, 3])).toEqual({ type: "number" })
    })

    it("should infer date type", () => {
      expect(inferCreateFieldType(["2023-05-01"])).toEqual({ type: "date" })
    })

    it("should infer json type", () => {
      expect(inferCreateFieldType([{ key: "value" }])).toEqual({ type: "json" })
    })

    it("should infer select type for repeated values", () => {
      const result = inferCreateFieldType(["a", "b", "a", "b", "c", "a", "b", "c", "a", "b", "c"])
      expect(result.type).toBe("select")
      expect((result as ICreateSelectFieldDTO).option?.options).toBeDefined()
    })

    it("should infer string type for other cases", () => {
      expect(inferCreateFieldType(["abc", "def"])).toEqual({ type: "string" })
    })
  })

  describe("isFieldSortable", () => {
    it("should return true for sortable field types", () => {
      expect(isFieldSortable("string")).toBe(true)
      expect(isFieldSortable("id")).toBe(true)
    })

    it("should return false for non-sortable field types", () => {
      expect(isFieldSortable("json")).toBe(false)
    })
  })

  describe("getIsSystemFieldType", () => {
    it("should return true for system field types", () => {
      expect(getIsSystemFieldType("id")).toBe(true)
    })

    it("should return false for non-system field types", () => {
      expect(getIsSystemFieldType("string")).toBe(false)
    })
  })

  describe("getIsFilterableFieldType", () => {
    it("should return true for filterable field types", () => {
      expect(getIsFilterableFieldType("string")).toBe(true)
    })

    it("should return false for non-filterable field types", () => {
      expect(getIsFilterableFieldType("attachment")).toBe(false)
    })
  })

  describe("getIsMutableFieldType", () => {
    it("should return true for mutable field types", () => {
      expect(getIsMutableFieldType("string")).toBe(true)
    })

    it("should return false for immutable field types", () => {
      expect(getIsMutableFieldType("id")).toBe(false)
    })
  })

  describe("getIsFieldCanBeRollup", () => {
    it("should return true for fields that can be rolled up", () => {
      expect(getIsFieldCanBeRollup("number")).toBe(true)
    })

    it("should return false for fields that cannot be rolled up", () => {
      expect(getIsFieldCanBeRollup("json")).toBe(false)
    })
  })

  describe("getRollupFnByType", () => {
    it("should return correct rollup functions for number type", () => {
      expect(getRollupFnByType("number")).toEqual(["sum", "average", "max", "min", "count", "lookup"])
    })

    it("should return correct rollup functions for date type", () => {
      expect(getRollupFnByType("date")).toEqual(["max", "min", "count", "lookup"])
    })

    it("should return correct rollup functions for string type", () => {
      expect(getRollupFnByType("string")).toEqual(["lookup", "count"])
    })

    it("should return empty array for unsupported types", () => {
      expect(getRollupFnByType("json")).toEqual([])
    })
  })

  describe("castFieldValue", () => {
    it("should cast number values", () => {
      expect(castFieldValue({ type: "number", name: "number" }, "123")).toBe(123)
    })

    it("should cast checkbox values", () => {
      expect(castFieldValue({ type: "checkbox", name: "checkbox" }, "true")).toBe(true)
      // expect(castFieldValue({ type: "checkbox", name: "checkbox" }, "false")).toBe(false)
    })

    it("should handle select values", () => {
      expect(
        castFieldValue(
          {
            type: "select",
            constraint: { max: 1 },
            name: "select",
            option: { options: [{ id: "option1", name: "option1", color: "blue" }] },
          },
          "option1",
        ),
      ).toBe("option1")
      expect(
        castFieldValue(
          {
            type: "select",
            name: "select",
            option: {
              options: [
                { id: "option1", name: "option1", color: "blue" },
                { id: "option2", name: "option2", color: "red" },
              ],
            },
          },
          "option1,option2",
        ),
      ).toEqual(["option1", "option2"])
    })

    it("should return original value for other types", () => {
      expect(castFieldValue({ type: "string", name: "string" }, "value")).toBe("value")
    })
  })

  describe("getIsDisplayFieldType", () => {
    it("should return true for display field types", () => {
      expect(getIsDisplayFieldType("string")).toBe(true)
    })

    it("should return false for non-display field types", () => {
      expect(getIsDisplayFieldType("json")).toBe(false)
    })
  })

  describe("getIsFieldHasDisplayValue", () => {
    it("should return true for fields with display value", () => {
      expect(getIsFieldHasDisplayValue("select")).toBe(true)
    })

    it("should return false for fields without display value", () => {
      expect(getIsFieldHasDisplayValue("string")).toBe(false)
    })
  })
})
