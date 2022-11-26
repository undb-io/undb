import { NanoID } from '@egodb/domain'

export class ColumnId extends NanoID {
  private static COLUMN_ID_PREFIX = 'col'
  private static COLUMN_ID_SIZE = 5

  constructor() {
    super(ColumnId.COLUMN_ID_PREFIX, ColumnId.COLUMN_ID_SIZE)
  }
}
