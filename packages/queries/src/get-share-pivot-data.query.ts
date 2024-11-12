import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { getPivotDataOutput, tableId, viewId } from "@undb/table"
import { z } from "@undb/zod"

export const getSharePivotDataQuery = z.object({
  shareId: shareIdSchema,
  tableId: tableId.optional(),
  viewId: viewId.optional(),
})

export type IGetSharePivotDataQuery = z.infer<typeof getSharePivotDataQuery>

export const getSharePivotDataOutput = getPivotDataOutput

export type IGetSharePivotDataOutput = z.infer<typeof getSharePivotDataOutput>

export class GetSharePivotDataQuery extends Query implements IGetSharePivotDataQuery {
  public readonly shareId: string
  public readonly tableId: string | undefined
  public readonly viewId: string | undefined

  constructor(props: QueryProps<IGetSharePivotDataQuery>) {
    super()
    this.shareId = props.shareId
    this.tableId = props.tableId
    this.viewId = props.viewId
  }
}
