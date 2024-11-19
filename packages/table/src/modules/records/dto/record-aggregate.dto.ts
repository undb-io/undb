import { z } from "@undb/zod"
import { uniqueTableDTO } from "../../../dto/unique-table.dto"
import { tableId } from "../../../table-id.vo"
import { aggregateConditionGroup } from "../../aggregate"
import { fieldId, fieldName } from "../../schema"
import { viewAggregate, viewId, viewName } from "../../views"

export const aggregateResult = z.number().or(z.string().date()).nullable()

export type AggregateResult = z.infer<typeof aggregateResult>

export const getAggregatesDTO = z
  .object({
    tableId: tableId,
    viewId: viewId.optional(),
    viewName: viewName.optional(),
    aggregate: viewAggregate.optional(),
    condition: aggregateConditionGroup.optional(),
    ignoreView: z.boolean().optional(),
    select: fieldId.or(fieldName).array().optional(),

    isReadable: z.boolean().optional(),
  })
  .merge(uniqueTableDTO)

export type IGetAggregatesDTO = z.infer<typeof getAggregatesDTO>
