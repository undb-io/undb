import { Entity } from '@egodb/domain'
import * as z from 'zod'
import type { ColumnId } from './value-objects/column-id.vo'

export const baseColumnSchema = z.object({
  name: z.string().min(2).max(20),
})

export type BaseColumnProps = z.infer<typeof baseColumnSchema>

export abstract class Column<CP extends BaseColumnProps = BaseColumnProps> extends Entity<ColumnId, CP> {
  constructor(protected _id: ColumnId, props: CP) {
    super({ id: _id, props })
  }
}
