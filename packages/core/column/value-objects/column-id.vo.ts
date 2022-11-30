import { NanoID } from '@egodb/domain'
import * as z from 'zod'

export const columnIdSchema = z.string().min(1)

export class ColumnId extends NanoID {
  private static COLUMN_ID_PREFIX = ''
  private static COLUMN_ID_SIZE = 5
  public get value(): string {
    return this.props.value
  }

  static create(): ColumnId {
    const id = NanoID.createId(ColumnId.COLUMN_ID_PREFIX, this.COLUMN_ID_SIZE)
    return new this(columnIdSchema.parse(id))
  }

  static from(id: string): ColumnId {
    return new this(id)
  }
}
