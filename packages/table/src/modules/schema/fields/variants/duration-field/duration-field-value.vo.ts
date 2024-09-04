import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const durationFieldValue = z.number().nonnegative().nullable()
export type IDurationFieldValue = z.infer<typeof durationFieldValue>

export function durationToMilliseconds(duration: string) {
  const parts = duration.split(":").map(Number)
  let milliseconds = 0

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    milliseconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000
  } else if (parts.length === 2) {
    const [minutes, seconds] = parts
    milliseconds = minutes * 60 * 1000 + seconds * 1000
  }

  return milliseconds
}

export function millisecondsToDuration(milliseconds: number) {
  const hours = Math.floor(milliseconds / (60 * 60 * 1000))
  const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.round((milliseconds % (60 * 1000)) / 1000)

  let result = ""
  if (hours > 0) {
    result += `${hours.toString().padStart(2, "0")}:`
  }
  result += `${minutes.toString().padStart(2, "0")}:`
  result += seconds.toString().padStart(2, "0")

  return result
}

export const durationPattern = /^(?:(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]|[0-5][0-9]:[0-5][0-9])$/

export function isDurationString(value: string): boolean {
  return durationPattern.test(value)
}

export class DurationFieldValue extends FieldValueObject<IDurationFieldValue> {
  constructor(value: IDurationFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
