import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import { viewId } from "../../views"

export const aggregateResult = z.number().or(z.string().date()).nullable()

export type AggregateResult = z.infer<typeof aggregateResult>

export const getAggregatesDTO = z.object({
  tableId: tableId,
  viewId: viewId.optional(),
})

export type IGetAggregatesDTO = z.infer<typeof getAggregatesDTO>
