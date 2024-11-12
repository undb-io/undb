import { Query, type QueryProps } from "@undb/domain"
import { tableId, viewId } from "@undb/table"
import { z } from "@undb/zod"

export const getPivotDataQuery = z.object({
  tableId: tableId,
  viewId: viewId,
})

export type IGetPivotDataQuery = z.infer<typeof getPivotDataQuery>

export class GetPivotDataQuery extends Query implements IGetPivotDataQuery {
  public readonly tableId: string
  public readonly viewId: string

  constructor(props: QueryProps<IGetPivotDataQuery>) {
    super()
    this.tableId = props.tableId
    this.viewId = props.viewId
  }
}
