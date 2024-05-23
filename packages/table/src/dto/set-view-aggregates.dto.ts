import { z } from "@undb/zod"
import { viewAggregate, viewId } from "../modules"
import { tableId } from "../table-id.vo"

export const setViewAggregatesDTO = z.object({
  tableId: tableId,
  viewId: viewId.optional(),
  aggregates: viewAggregate,
})

export type ISetViewAggregatesDTO = z.infer<typeof setViewAggregatesDTO>
