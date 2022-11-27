import { NanoID } from '@egodb/domain'
import * as z from 'zod'

export const tableIdSchema = z.string().min(1)

export class TableId extends NanoID {
  private static TABLE_ID_PREFIX = 'tbl'
  private static TABLE_ID_SIZE = 8

  static create(): TableId {
    const id = NanoID.createId(TableId.TABLE_ID_PREFIX, TableId.TABLE_ID_SIZE)
    return new TableId(id)
  }

  static from(id: string): TableId {
    return new TableId(id)
  }

  static fromOrCreate(id?: string): TableId {
    if (!id) {
      return TableId.create()
    }
    return new TableId(id)
  }
}
