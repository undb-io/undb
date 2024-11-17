import { Query, type QueryProps } from "@undb/domain"
import {
  aggregateResult,
  fieldId,
  getAggregatesDTO,
  type IAggregateConditionGroup,
  type IViewAggregate,
} from "@undb/table"
import { z } from "@undb/zod"

export const getAggregatesQuery = getAggregatesDTO

export type IGetAggregatesQuery = z.infer<typeof getAggregatesQuery>

export const getAggregatesOutput = z.record(fieldId, aggregateResult)

export type IGetAggregatesOutput = z.infer<typeof getAggregatesOutput>

export class GetAggregatesQuery extends Query implements IGetAggregatesQuery {
  public readonly tableId?: string
  public readonly baseName?: string
  public readonly tableName?: string
  public readonly viewId?: string
  public readonly viewName?: string
  public readonly aggregate?: IViewAggregate
  public readonly condition?: IAggregateConditionGroup
  public readonly ignoreView?: boolean
  public readonly isReadable?: boolean

  constructor(props: QueryProps<IGetAggregatesQuery>) {
    super()
    this.tableId = props.tableId
    this.baseName = props.baseName
    this.tableName = props.tableName
    this.viewId = props.viewId
    this.viewName = props.viewName
    this.aggregate = props.aggregate
    this.condition = props.condition
    this.ignoreView = props.ignoreView
    this.isReadable = props.isReadable
  }
}
