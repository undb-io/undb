import { NanoID } from '@egodb/domain'
import * as z from 'zod'

export const tableIdSchema = z.string().min(1)

export class TableId extends NanoID {
  private static TABLE_ID_PREFIX = 'tbl'
  private static TABLE_ID_SIZE = 8

  constructor() {
    super(TableId.TABLE_ID_PREFIX, TableId.TABLE_ID_SIZE)
  }
}
