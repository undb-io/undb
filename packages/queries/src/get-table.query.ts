import { Query, type QueryProps } from "@undb/domain"
import { tableId } from "@undb/table"
import { z } from "@undb/zod"

export const getTableQuery = z.object({
  tableId: tableId,
})

export type IGetTableQuery = z.infer<typeof getTableQuery>

export class GetTableQuery extends Query implements IGetTableQuery {
  public readonly tableId: string

  constructor(props: QueryProps<IGetTableQuery>) {
    super()
    this.tableId = props.tableId
  }
}
