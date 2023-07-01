import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import { type Table } from '../table.js'
import { TableEmoji } from '../value-objects/table-emoji.vo.js'
import type { ITableSpecVisitor } from './interface.js'

export class WithTableEmoji extends CompositeSpecification {
  constructor(public readonly emoji: TableEmoji) {
    super()
  }

  static fromString(emoji?: string | null): WithTableEmoji {
    return new WithTableEmoji(new TableEmoji(emoji))
  }

  static unsafe(emoji: string): WithTableEmoji {
    return new WithTableEmoji(new TableEmoji(emoji))
  }

  isSatisfiedBy(t: Table): boolean {
    return this.emoji.equals(t.emoji)
  }

  mutate(t: Table): Result<Table, string> {
    t.emoji = this.emoji
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.emojiEqual(this)
    return Ok(undefined)
  }
}
