import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const tableEmojiSchema = z.string().emoji()

export const DEFAULT_TABLE_EMOJI = ':thumbsup:'

export class TableEmoji extends ValueObject<string> {
  constructor(emoji: string) {
    super({ value: tableEmojiSchema.parse(emoji) })
  }
}
