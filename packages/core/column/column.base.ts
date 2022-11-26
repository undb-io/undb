import { Entity } from '@egodb/domain'
import type { ColumnId } from './value-objects/column-id.vo'

type BaseColumnProps = {
  id: ColumnId
  name: string
}

export abstract class Column<CP extends BaseColumnProps> extends Entity<ColumnId, CP> {}
