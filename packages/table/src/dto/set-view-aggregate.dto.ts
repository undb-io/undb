import { z } from "@undb/zod"
import { viewAggregate, viewId } from "../modules"
import { tableId } from "../table-id.vo"

export const setViewAggregateDTO = z.object({
  tableId: tableId,
  viewId: viewId.optional(),
  aggregate: viewAggregate,
})

export type ISetViewAggregateDTO = z.infer<typeof setViewAggregateDTO>
