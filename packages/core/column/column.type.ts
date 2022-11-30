import type { ColumnId, ColumnName, ColumnValueConstraints } from './value-objects'

export interface IBaseColumn {
  id: ColumnId
  name: ColumnName
  valueConstrains: ColumnValueConstraints
}

export type ITextColumn = IBaseColumn
export type INumberColumn = IBaseColumn

import type { NumberColumn } from './number.column'
import type { TextColumn } from './text.column'

export type Column = TextColumn | NumberColumn
