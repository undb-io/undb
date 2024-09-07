import { pagniationSchema, Query, type IPagination, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { fieldId, recordsDTO, tableId, viewFilterGroup, viewId, type IViewFilterGroup } from "@undb/table"
import { z } from "@undb/zod"

export const getShareRecordsQuery = z.object({
  shareId: shareIdSchema,
  tableId: tableId.optional(),
  viewId: viewId.optional(),
  q: z.string().optional().nullable(),
  filters: viewFilterGroup.optional(),
  select: fieldId.array().optional(),
  pagination: pagniationSchema.optional(),
})

export type IGetShareRecordsQuery = z.infer<typeof getShareRecordsQuery>

export const getShareRecordsOutput = z.object({
  total: z.number(),
  records: recordsDTO,
})

export type IGetShareRecordsOutput = z.infer<typeof getShareRecordsOutput>

export class GetShareRecordsQuery extends Query implements IGetShareRecordsQuery {
  public readonly shareId: string
  public readonly tableId: string | undefined
  public readonly viewId: string | undefined
  public readonly q: string | undefined | null
  public readonly filters: IViewFilterGroup | undefined
  public readonly select: string[] | undefined
  public readonly pagination: IPagination | undefined

  constructor(props: QueryProps<IGetShareRecordsQuery>) {
    super()
    this.shareId = props.shareId
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.q = props.q
    this.filters = props.filters
    this.select = props.select
    this.pagination = props.pagination
  }
}
