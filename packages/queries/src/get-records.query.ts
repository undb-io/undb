import { Query, type IPagination, type QueryProps } from "@undb/domain"
import { getRecordsDTO, recordsDTO, type IViewFilterGroup } from "@undb/table"
import { z } from "@undb/zod"

export const getRecordsQuery = getRecordsDTO

export type IGetRecordsQuery = z.infer<typeof getRecordsQuery>

export const getRecordsOutput = z.object({
  total: z.number(),
  records: recordsDTO,
})

export type IGetRecordsOutput = z.infer<typeof getRecordsOutput>

export class GetRecordsQuery extends Query implements IGetRecordsQuery {
  public readonly tableId?: string
  public readonly baseName?: string
  public readonly tableName?: string
  public readonly viewName?: string
  public readonly viewId?: string
  public readonly ignoreView?: boolean
  public readonly filters?: IViewFilterGroup
  public readonly q?: string
  public readonly pagination?: IPagination
  public readonly select?: string[]

  constructor(props: QueryProps<IGetRecordsQuery>) {
    super()
    this.tableId = props.tableId
    this.baseName = props.baseName
    this.tableName = props.tableName
    this.viewName = props.viewName
    this.viewId = props.viewId
    this.ignoreView = props.ignoreView
    this.filters = props.filters
    this.q = props.q
    this.pagination = props.pagination
    this.select = props.select
  }
}
