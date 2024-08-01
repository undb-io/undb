import { Query } from "@undb/domain"
import { fieldId, tableId } from "@undb/table"
import { z } from "@undb/zod"

export const getRollupForeignTablesQuery = z.object({
  tableId,
  fieldId,
})

export type IGetRollupForeignTablesQuery = z.infer<typeof getRollupForeignTablesQuery>

export class GetRollupForeignTablesQuery extends Query implements IGetRollupForeignTablesQuery {
  public readonly tableId: string
  public readonly fieldId: string

  constructor(props: IGetRollupForeignTablesQuery) {
    super()
    this.tableId = props.tableId
    this.fieldId = props.fieldId
  }
}
