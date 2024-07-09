import { Query, type QueryProps } from "@undb/domain"
import { countRecordsDTO, type IViewFilterGroup } from "@undb/table"
import { z } from "@undb/zod"

export const countRecordsQuery = countRecordsDTO

export type ICountRecordsQuery = z.infer<typeof countRecordsQuery>

export const countRecordsOutput = z.object({
  count: z.number(),
})

export type ICountRecordsOutput = z.infer<typeof countRecordsOutput>

export class CountRecordsQuery extends Query implements ICountRecordsQuery {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly filters?: IViewFilterGroup
  public readonly q?: string

  constructor(props: QueryProps<ICountRecordsQuery>) {
    super()
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.filters = props.filters
    this.q = props.q
  }
}
