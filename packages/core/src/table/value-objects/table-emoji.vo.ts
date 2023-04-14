import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const tableEmojiSchema = z.string()

export const DEFAULT_TABLE_EMOJI = '1f44d'

export class TableEmoji extends ValueObject<string> {
  constructor(emoji: string) {
    super({ value: tableEmojiSchema.parse(emoji) })
  }
}
