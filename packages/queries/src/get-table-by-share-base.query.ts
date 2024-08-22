import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { tableId } from "@undb/table"
import { z } from "@undb/zod"

export const getTableByShareBaseQuery = z.object({
  shareId: shareIdSchema,
  tableId: tableId,
})

export type IGetTableByShareBaseQuery = z.infer<typeof getTableByShareBaseQuery>

export class GetTableByShareBaseQuery extends Query implements IGetTableByShareBaseQuery {
  public readonly shareId: string
  public readonly tableId: string

  constructor(props: QueryProps<IGetTableByShareBaseQuery>) {
    super()
    this.shareId = props.shareId
    this.tableId = props.tableId
  }
}
