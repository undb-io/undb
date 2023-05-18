import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const TIME_FORMATS = ['hh:mm bbb', 'HH:mm']

export const DEFAULT_TIME_FORMAT = TIME_FORMATS[0]

export const timeFormat = z.string().nullable()

export type ITimeFormat = z.infer<typeof timeFormat>

export class TimeFormat extends ValueObject<ITimeFormat> {
  static from(format?: string | null) {
    const value = timeFormat.parse(format ?? null)
    return new this({ value })
  }
}
