import { Query, type QueryProps } from "@undb/domain"
import { tableId } from "@undb/table"
import { z } from "@undb/zod"

export const getTableForeignTablesQuery = z.object({
  tableId,
})

export type IGetTableForeignTablesQuery = z.infer<typeof getTableForeignTablesQuery>

export class GetTableForeignTablesQuery extends Query implements IGetTableForeignTablesQuery {
  public readonly tableId: string

  constructor(props: QueryProps<IGetTableForeignTablesQuery>) {
    super()
    this.tableId = props.tableId
  }
}
