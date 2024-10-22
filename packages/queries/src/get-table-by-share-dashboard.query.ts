import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { tableId } from "@undb/table"
import { z } from "@undb/zod"

export const getTableByShareDashboardQuery = z.object({
  shareId: shareIdSchema,
  tableId: tableId,
})

export type IGetTableByShareDashboardQuery = z.infer<typeof getTableByShareDashboardQuery>

export class GetTableByShareDashboardQuery extends Query implements IGetTableByShareDashboardQuery {
  public readonly shareId: string
  public readonly tableId: string

  constructor(props: QueryProps<IGetTableByShareDashboardQuery>) {
    super()
    this.shareId = props.shareId
    this.tableId = props.tableId
  }
}
