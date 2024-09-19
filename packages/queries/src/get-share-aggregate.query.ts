import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { aggregateResult, fieldId, tableId, viewId } from "@undb/table"
import { z } from "@undb/zod"

export const getShareAggregatesQuery = z.object({
  shareId: shareIdSchema,
  tableId: tableId.optional(),
  viewId: viewId.optional(),
})

export type IGetShareAggregatesQuery = z.infer<typeof getShareAggregatesQuery>

export const getShareAggregatesOutput = z.record(fieldId, aggregateResult)

export type IGetShareAggregatesOutput = z.infer<typeof getShareAggregatesOutput>

export class GetShareAggregatesQuery extends Query implements IGetShareAggregatesQuery {
  public readonly shareId: string
  public readonly tableId: string | undefined
  public readonly viewId: string | undefined

  constructor(props: QueryProps<IGetShareAggregatesQuery>) {
    super()
    this.shareId = props.shareId
    this.tableId = props.tableId
    this.viewId = props.viewId
  }
}
