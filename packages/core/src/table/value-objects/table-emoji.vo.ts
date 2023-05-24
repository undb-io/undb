import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const tableEmojiSchema = z.string().nullable().optional()

export type ITableEmojiSchema = z.infer<typeof tableEmojiSchema>

export class TableEmoji extends ValueObject<ITableEmojiSchema> {
  constructor(emoji?: string | null) {
    super({ value: tableEmojiSchema.parse(emoji) ?? null })
  }
}
