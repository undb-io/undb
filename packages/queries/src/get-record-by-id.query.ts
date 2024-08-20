import { Query, type QueryProps } from "@undb/domain"
import { getRecordByIdDTO, recordDTO } from "@undb/table"
import { z } from "@undb/zod"

export const getRecordByIdQuery = getRecordByIdDTO

export type IGetRecordByIdQuery = z.infer<typeof getRecordByIdQuery>

export const getRecordByIdOutput = z.object({
  record: recordDTO.nullable(),
})

export type IGetRecordByIdOutput = z.infer<typeof getRecordByIdOutput>

export class GetRecordByIdQuery extends Query implements IGetRecordByIdQuery {
  public readonly tableId?: string
  public readonly baseName?: string
  public readonly tableName?: string
  public readonly id: string
  public readonly select?: string[]
  public readonly viewId?: string
  public readonly viewName?: string
  public readonly ignoreView?: boolean

  constructor(props: QueryProps<IGetRecordByIdQuery>) {
    super()
    this.tableId = props.tableId
    this.baseName = props.baseName
    this.tableName = props.tableName
    this.id = props.id
    this.select = props.select
    this.viewId = props.viewId
    this.viewName = props.viewName
    this.ignoreView = props.ignoreView
  }
}
