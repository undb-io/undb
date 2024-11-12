import { Query, type QueryProps } from "@undb/domain"
import { getPivotDataDTO } from "@undb/table"
import { z } from "@undb/zod"

export const getPivotDataQuery = getPivotDataDTO

export type IGetPivotDataQuery = z.infer<typeof getPivotDataQuery>

export class GetPivotDataQuery extends Query implements IGetPivotDataQuery {
  public readonly tableId?: string
  public readonly baseName?: string
  public readonly tableName?: string
  public readonly viewId?: string
  public readonly viewName?: string

  constructor(props: QueryProps<IGetPivotDataQuery>) {
    super()
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.baseName = props.baseName
    this.tableName = props.tableName
    this.viewName = props.viewName
  }
}
