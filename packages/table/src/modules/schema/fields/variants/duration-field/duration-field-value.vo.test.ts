import { describe, expect, it } from "bun:test"
import {
  DurationFieldValue,
  durationToMilliseconds,
  isDurationString,
  millisecondsToDuration,
} from "./duration-field-value.vo"

describe("durationToMilliseconds", () => {
  it("should correctly convert 3-part time strings", () => {
    expect(durationToMilliseconds("01:30:45")).toBe(5445000)
    expect(durationToMilliseconds("00:00:00")).toBe(0)
    expect(durationToMilliseconds("23:59:59")).toBe(86399000)
  })

  it("should correctly convert 2-part time strings", () => {
    expect(durationToMilliseconds("30:45")).toBe(1845000)
    expect(durationToMilliseconds("00:00")).toBe(0)
    expect(durationToMilliseconds("59:59")).toBe(3599000)
  })

  it("should handle edge cases", () => {
    expect(durationToMilliseconds("")).toBe(0)
    expect(durationToMilliseconds(":")).toBe(0)
    expect(durationToMilliseconds(":::")).toBe(0)
  })
})

describe("millisecondsToDuration", () => {
  it("should convert milliseconds to duration string", () => {
    expect(millisecondsToDuration(3723000)).toBe("01:02:03")
    expect(millisecondsToDuration(0)).toBe("00:00")
    expect(millisecondsToDuration(60000)).toBe("01:00")
    expect(millisecondsToDuration(990)).toBe("00:01")
  })
})

describe("DurationFieldValue", () => {
  it("should create an instance with a value", () => {
    const durationFieldValue = new DurationFieldValue(3723000)
    expect(durationFieldValue.props.value).toBe(3723000)
  })

  it("should create an instance with a null value", () => {
    const durationFieldValue = new DurationFieldValue(null)
    expect(durationFieldValue.props.value).toBeNull()
  })

  it("should correctly identify an empty value", () => {
    const durationFieldValue = new DurationFieldValue(null)
    expect(durationFieldValue.isEmpty()).toBe(true)

    const durationFieldValueWithValue = new DurationFieldValue(3723000)
    expect(durationFieldValueWithValue.isEmpty()).toBe(false)
  })
})

describe("isDurationString", () => {
  it("should return true for valid duration strings", () => {
    expect(isDurationString("12:34:56")).toBe(true)
    expect(isDurationString("00:00:00")).toBe(true)
    expect(isDurationString("23:59:59")).toBe(true)
    expect(isDurationString("59:59")).toBe(true)
  })

  it("should return false for invalid duration strings", () => {
    expect(isDurationString("24:00:00")).toBe(false)
    expect(isDurationString("12:60:00")).toBe(false)
    expect(isDurationString("12:34:60")).toBe(false)
    expect(isDurationString("123:45:67")).toBe(false)
    expect(isDurationString("12:34")).toBe(true)
    expect(isDurationString("12:34:")).toBe(false)
    expect(isDurationString("12:34:56:78")).toBe(false)
    expect(isDurationString("abc")).toBe(false)
    expect(isDurationString("")).toBe(false)
  })
})
