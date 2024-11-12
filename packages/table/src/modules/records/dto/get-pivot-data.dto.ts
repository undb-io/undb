import { z } from "@undb/zod"
import { uniqueTableDTO } from "../../../dto/unique-table.dto"
import { pivotAggregateSchema, viewId, viewName } from "../../views"

export const getPivotDataDTO = z
  .object({
    viewId: viewId.optional(),
    viewName: viewName.optional(),
  })
  .merge(uniqueTableDTO)

export type IGetPivotDataDTO = z.infer<typeof getPivotDataDTO>

export const getPivotDataOutput = z
  .object({
    label: z.string(),
    values: z.record(z.number()),
    agg: pivotAggregateSchema,
  })
  .array()

export type IGetPivotDataOutput = z.infer<typeof getPivotDataOutput>
