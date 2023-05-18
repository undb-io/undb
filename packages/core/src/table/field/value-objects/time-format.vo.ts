import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const timeFormat = z.string().nullable()

export type ITimeFormat = z.infer<typeof timeFormat>

export class TimeFormat extends ValueObject<ITimeFormat> {
  static from(format?: string | null) {
    const value = timeFormat.parse(format ?? null)
    return new this({ value })
  }
}
