import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import {
  aggregateConditionGroup,
  aggregateResult,
  fieldId,
  tableId,
  viewAggregate,
  viewId,
  type IAggregateConditionGroup,
  type IViewAggregate,
} from "@undb/table"
import { z } from "@undb/zod"

export const getShareAggregatesQuery = z.object({
  shareId: shareIdSchema,
  tableId: tableId,
  viewId: viewId.optional(),
  aggregate: viewAggregate.optional(),
  condition: aggregateConditionGroup.optional(),
  ignoreView: z.boolean().optional(),
})

export type IGetShareAggregatesQuery = z.infer<typeof getShareAggregatesQuery>

export const getShareAggregatesOutput = z.record(fieldId, aggregateResult)

export type IGetShareAggregatesOutput = z.infer<typeof getShareAggregatesOutput>

export class GetShareAggregatesQuery extends Query implements IGetShareAggregatesQuery {
  public readonly shareId: string
  public readonly tableId: string
  public readonly viewId: string | undefined
  public readonly aggregate: IViewAggregate | undefined
  public readonly condition: IAggregateConditionGroup | undefined
  public readonly ignoreView?: boolean

  constructor(props: QueryProps<IGetShareAggregatesQuery>) {
    super()
    this.shareId = props.shareId
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.aggregate = props.aggregate
    this.condition = props.condition
    this.ignoreView = props.ignoreView
  }
}
